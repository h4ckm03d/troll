# TROLL

⚠️ **Warning**: This project is under **active and heavy development**. The API is subject to change as new features are added and improvements are made. It is recommended to use specific versions in production environments until a stable release is available.

---

## TROLL

Welcome to the **TROLL Rule Engine**, a powerful and flexible library for defining and managing business rules in TypeScript. This rule engine allows you to dynamically create, evaluate, and apply business rules to various contexts such as promotions, customer actions, or workflows.

## Table of Contents

- [Introduction](#introduction)
- [Warning](#warning)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Milestones](#milestones)
- [Contributing](#contributing)
- [License](#license)

## Warning

⚠️ **Important**: This project is under **heavy development** and the API is subject to frequent changes. Until we release a stable version, breaking changes may occur. For production environments, consider using specific tagged versions to avoid unexpected changes.

## Introduction

The **TROLL Rule Engine** is a lightweight and customizable TypeScript-based engine designed to evaluate rules based on conditions and trigger actions accordingly. It is built to handle complex rule scenarios in a scalable and maintainable way, making it ideal for applications that require flexible business logic.

## Features

- **Dynamic Rule Definition**: Easily define and modify rules without changing core code.
- **Condition-Based Evaluation**: Apply rules based on simple or complex conditions.
- **Action Triggering**: Execute specific actions when rule conditions are met.
- **Extensibility**: Add custom rules, conditions, and actions.
- **Priority-Based Execution**: Order rule execution by priority.
- **Strong TypeScript Support**: Type-safe implementation for better development experience.

## Tech Stack

- **TypeScript**: Type-safe language for scalable and maintainable code.
- **Node.js**: Runtime for executing the rule engine.
- **Jest**: Unit testing framework to ensure reliable functionality.

## Installation

To start using the **TROLL** rule engine, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/h4ckm03d/troll.git
   ```

2. Navigate into the project directory:

   ```bash
   cd troll
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the tests:

   ```bash
   npm run test
   ```

## Usage

### Defining a Rule

Here’s a basic example of how to define a rule that applies a discount based on certain conditions:

```ts
import { RuleEngine, StatelessRule, Action, LoyaltyContext } from 'troll'; 

// Define action to apply a discount
const applyDiscountAction: Action<LoyaltyContext> = (context) => {
  const newItems = context.orderData.items.map(item => ({
    ...item, 
    discount: 0.1  // Apply a 10% discount
  }));

  return {
    ...context,
    orderData: {
      ...context.orderData,
      items: newItems
    }
  };
};

// Define condition to check SKU
export const includeSkuRule = (includeSkuList: string[]): StatelessRule<LoyaltyContext> => (context) =>
  context.orderData.items.some(item => includeSkuList.includes(item.itemCode));

// Initialize Rule Engine
const engine = new RuleEngine<LoyaltyContext>([
  { rule: includeSkuRule(['sku1']), action: applyDiscountAction },
]);

// Define the context
const context = {
  customerId: 'customer1',
  eventName: 'Loyalty Program',
  orderData: {
    items: [
      { itemCode: 'sku1', quantity: 2, discount: 0, price: 50 },
      { itemCode: 'sku4', quantity: 1, discount: 0, price: 30 }
    ],
    transactionDate: new Date(),
  }
};

const updatedContext = await engine.run(context);
console.log(updatedContext.orderData.items[0].discount);  // 0.1 (10% discount applied)
```

### Adding New Rules

To add new rules, simply extend the rules array in the `RuleEngine` instance and define the new conditions and actions.

### Custom Rule Types

You can create new rule types by extending the `Rule` interface or adding more complex condition evaluation functions.

## Milestones

### Milestone 1: Core Rule Engine

- [x] Setup TypeScript environment.
- [x] Define the structure for conditions and actions.
- [x] Implement the core rule evaluation logic.
- [x] Unit tests for core functionality.

### Milestone 2: Multiple Rules and Prioritization

- [x] Support multiple rule definitions.
- [x] Prioritize rule execution.
- [x] Logging for rule evaluation.
- [ ] Integration tests for multi-rule scenarios.

### Milestone 3: Rule Groups and Complex Conditions

- [ ] Support for grouping of rules.
- [ ] Add condition combinations (AND/OR logic).
- [ ] Rule deactivation logic.
- [ ] Test coverage for group-based rule execution.

### Milestone 4: Optimization and Persistence

- [ ] Performance optimization for large rule sets.
- [ ] Support for storing and retrieving rules from databases (e.g., MongoDB, PostgreSQL).
- [ ] Provide example integrations with common databases.
- [ ] Performance benchmarking documentation.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Create a pull request.

## License

This project is licensed under the Apache License. See the [LICENSE](./LICENSE) file for more details.
