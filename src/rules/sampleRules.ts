import { StatefulRule, StatelessRule } from "./types";

export interface Context {
  age: number;
  userId: string;
}

// Sample stateful rule (simulating a database lookup)
export const fetchPermissionsFromDatabase = async (userId: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(userId === 'admin' ? ['admin'] : ['user']), 1000);
  });
};

// Stateless rule: checks if user is over 18
export const isOver18: StatelessRule<Context> = (context) => context.age > 18;

// Stateful rule: fetches user permissions from a database and checks if they have 'admin' permission
export const hasPermission: StatefulRule<Context> = async (context) => {
  const permissions = await fetchPermissionsFromDatabase(context.userId);
  return permissions.includes('admin');
};
