import type { Action, Rule, StatefulRule, StatelessRule } from "./types";

// Helper function to determine if a rule is stateless
const isStatelessRule = <T>(rule: Rule<T>): rule is StatelessRule<T> => {
	return rule.length === 1;
};

// Rule Engine Class
export class RuleEngine<T> {
	private readonly rules: Array<{ rule: Rule<T>; action?: Action<T> }>;

	constructor(rules: Array<{ rule: Rule<T>; action?: Action<T> }> = []) {
		this.rules = rules;
	}

	// Add a new rule and optional action to the engine
	addRule(rule: Rule<T>, action?: Action<T>): void {
		this.rules.push({ rule, action });
	}

	// Run all rules and trigger actions for successful ones
	async run(context: T): Promise<T> {
		let newContext = { ...context }; // Create a copy of the context

		for (const { rule, action } of this.rules) {
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
