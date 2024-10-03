// Rule interface definitions
export type StatelessRule<T> = (context: T) => boolean;

export type StatefulRule<T> = (context: T) => Promise<boolean>;

export type Rule<T> = StatelessRule<T> | StatefulRule<T>;

// Action returns a new context (or Promise for async actions)
export type Action<T> = (context: T) => T | Promise<T>;