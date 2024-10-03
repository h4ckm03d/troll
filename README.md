## TROLL

Welcome to the **Rule Engine** project! This repository contains the implementation of a customizable rule engine written in TypeScript, allowing you to define, evaluate, and manage business rules efficiently.

## Table of Contents

*   [Introduction](#introduction)
*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Installation](#installation)
*   [Usage](#usage)
*   [Milestones](#milestones)
*   [Contributing](#contributing)
*   [License](#license)

## Introduction

The **Rule Engine** is a flexible and efficient system for defining and applying business rules to various data and events. Whether for promotions, customer actions, or custom workflows, this engine helps create dynamic rule-based scenarios that can be extended and modified without changing the underlying code.

## Features

*   **Rule Definitions**: Define rules based on conditions, actions, and priorities.
*   **Condition Evaluation**: Evaluate simple or complex conditions on data.
*   **Action Execution**: Trigger predefined actions when rules are met.
*   **Custom Rules**: Easily extendable to add custom rule types.
*   **Priority-Based Execution**: Prioritize rules for specific order of execution.
*   **TypeScript Support**: Strongly typed for better code reliability and auto-completion.

## Tech Stack

*   **TypeScript**: Strongly typed JavaScript for scalable codebases.
*   **Node.js**: JavaScript runtime for executing the rule engine.
*   **Jest**: Testing framework for unit and integration tests.

## Installation

To get started with the rule engine, follow these steps:

1.  Clone the repository:
    
    ```
    git clone https://github.com/h4ckm03d/troll.git
    ```
    
2.  Install dependencies:
    
    ```
    cd troll
    npm install
    ```
    
3.  Run tests:
   ```
   npm run test
   ```

    

## Usage

### Defining a Rule

You can define a rule by specifying its conditions and actions. Here's a basic example:

```
import { RuleEngine } from './RuleEngine';

// Define your rules
const rules = [
  {
    id: 'rule-1',
    description: 'Give 10% discount if customer is premium',
    condition: (context) => context.customerType === 'premium',
    action: (context) => {
      context.discount = 0.1;
    },
    priority: 1,
  },
];

// Initialize the rule engine
const engine = new RuleEngine(rules);

// Define the context
const context = {
  customerType: 'premium',
  discount: 0,
};

// Execute the engine
engine.run(context);

console.log(context.discount); // 0.1 (10% discount applied)

```

### Adding New Rules

To add new rules, you simply append new objects to the rules array with custom logic for conditions and actions.

### Custom Rule Types

You can create new types of rules by extending the `Rule` interface or adding more complex condition evaluation functions.

## Milestones

Here are the key milestones and features planned for this project:

### Milestone 1: Core Rule Engine

-[x]   Setup TypeScript environment.
-[x]   Basic rule definition structure with conditions and actions.
-[ ]   Execute rules based on conditions.
-[ ]   Unit tests for core functionality.

### Milestone 2: Priority and Multiple Rule Evaluation

-[ ]   Support for multiple rules.
-[ ]   Prioritize rule execution.
-[ ]   Add logging for rule evaluation.
-[ ]   Integration tests for multi-rule execution.

### Milestone 3: Rule Groups and Conditions

-[ ]   Allow grouping of rules.
-[ ]   Add support for complex condition combinations (AND/OR conditions).
-[ ]   Add rule deactivation logic.
-[ ]   Improved test coverage for group-based execution.

### Milestone 4: Performance Optimization and Rule Persistence

-[ ]   Optimize rule execution for large datasets.
-[ ]   Support for storing and loading rules from a database.
-[ ]   Provide example integrations for popular databases (e.g., MongoDB, PostgreSQL).
-[ ]   Document performance benchmarks.

## Contributing

We welcome contributions!

### Steps to Contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature-branch`).
3.  Make your changes and commit them (`git commit -m 'Add new feature'`).
4.  Push to the branch (`git push origin feature-branch`).
5.  Create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.
