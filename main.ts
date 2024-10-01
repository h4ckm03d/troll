type StatelessRule<T> = (input: T) => boolean;

type StatefulRule<T> = (input: T) => Promise<boolean>;

const and = <T>(...rules: (StatelessRule<T> | StatefulRule<T>)[]): StatefulRule<T> => {
  return async (input: T) => {
    for (const rule of rules) {
      const result = rule instanceof Function ? rule(input) : await rule(input);
      if (!result) return false;
    }
    return true;
  };
};

const or = <T>(...rules: (StatelessRule<T> | StatefulRule<T>)[]): StatefulRule<T> => {
  return async (input: T) => {
    for (const rule of rules) {
      const result = rule instanceof Function ? rule(input) : await rule(input);
      if (result) return true;
    }
    return false;
  };
};
