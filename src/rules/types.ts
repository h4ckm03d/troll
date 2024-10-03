// Rule interface definitions
export type StatelessRule<T> = (context: T) => boolean;

export type StatefulRule<T> = (context: T) => Promise<boolean>;

export type Rule<T> = StatelessRule<T> | StatefulRule<T>;

// Helper function to determine if a rule is stateless
const isStatelessRule = <T>(rule: Rule<T>): rule is StatelessRule<T> => {
  return rule.length === 1;
};

// Combinator to check all rules
export const all = <T>(...rules: Rule<T>[]): StatefulRule<T> => async (context: T) => {
  for (const rule of rules) {
    const result = isStatelessRule(rule) ? rule(context) : await rule(context);
    if (!result) return false;
  }
  return true;
};

// Combinator to check if any rule is true
export const any = <T>(...rules: Rule<T>[]): StatefulRule<T> => async (context: T) => {
  for (const rule of rules) {
    const result = isStatelessRule(rule) ? rule(context) : await rule(context);
    if (result) return true;
  }
  return false;
};

// Combinator to negate a rule
export const not = <T>(rule: Rule<T>): StatefulRule<T> => async (context: T) => {
  if (isStatelessRule(rule)) {
    return !rule(context);
  } else {
    return !(await rule(context));
  }
};
