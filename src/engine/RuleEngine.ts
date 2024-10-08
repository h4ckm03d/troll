import type {
  Action,
  Rule,
  RuleConfig,
  StatefulRule,
  StatelessRule,
} from "./types";

// Helper function to determine if a rule is stateless
const isStatelessRule = <T>(rule: Rule<T>): rule is StatelessRule<T> => {
  return rule.length === 1;
};

// Rule Engine Class
export class RuleEngine<T> {
  private readonly rules: Map<string, Array<RuleConfig<T>>>;

  constructor(rules: Map<string, Array<RuleConfig<T>>> = new Map()) {
    this.rules = rules;
  }

  // Add a new rule and optional action to the engine with a specified key
  addRule(key: string, rule: Rule<T>, action?: Action<T>): void {
    if (!this.rules.has(key)) {
      this.rules.set(key, []);
    }

    this.rules.get(key)?.push({ rule, action });
  }

  // Remove all rules with a specified key
  removeRules(key: string): void {
    this.rules.delete(key);
  }

  // Run all rules and trigger actions for successful ones
  // Run all rules for a specific key and trigger actions for successful ones
  async run(key: string, context: T): Promise<T> {
    if (!this.rules.has(key)) {
      throw new Error(`No rules found for key: ${key}`);
    }

    let newContext = { ...context }; // Create a copy of the context

    // Sort rules by priority (lower priority value comes first)
    const sortedRules =
      this.rules
        .get(key)
        ?.sort((a, b) => a.priority ?? Infinity - (b.priority ?? Infinity)) ??
      [];

    for (const { rule, action } of sortedRules) {
      let rulePassed = false;

      if (isStatelessRule(rule)) {
        rulePassed = rule(newContext);
      } else {
        rulePassed = await rule(newContext);
      }

      if (rulePassed && action) {
        // If rule passes and action exists, update the context
        newContext = await action(newContext); // Ensure action returns a new context
      }
    }

    return newContext; // Return the updated context
  }

  // Run all rules for all keys and trigger actions for successful ones
  async runAll(context: T): Promise<T> {
    let newContext = { ...context }; // Create a copy of the context

    for (const rules of this.rules.values()) {
      // Sort rules by priority (lower priority value comes first)
      const sortedRules = rules.toSorted(
        (a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity)
      );

      for (const { rule, action } of sortedRules) {
        let rulePassed = false;

        if (isStatelessRule(rule)) {
          rulePassed = rule(newContext);
        } else {
          rulePassed = await rule(newContext);
        }

        if (rulePassed && action) {
          // If rule passes and action exists, update the context
          newContext = await action(newContext); // Ensure action returns a new context
        }
      }
    }

    return newContext; // Return the updated context
  }
}

// Combinator to check all rules
export const all =
  <T>(...rules: Rule<T>[]): StatefulRule<T> =>
  async (context: T) => {
    for (const rule of rules) {
      const result = isStatelessRule(rule)
        ? rule(context)
        : await rule(context);
      if (!result) return false;
    }
    return true;
  };

// Combinator to check if any rule is true
export const any =
  <T>(...rules: Rule<T>[]): StatefulRule<T> =>
  async (context: T) => {
    for (const rule of rules) {
      const result = isStatelessRule(rule)
        ? rule(context)
        : await rule(context);
      if (result) return true;
    }
    return false;
  };

// Combinator to negate a rule
export const not =
  <T>(rule: Rule<T>): StatefulRule<T> =>
  async (context: T) => {
    return !(isStatelessRule(rule) ? rule(context) : await rule(context));
  };
