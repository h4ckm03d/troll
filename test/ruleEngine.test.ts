import { all } from '../src';
import { isOver18, hasPermission } from '../src/rules/sampleRules';

test('should pass when all conditions are true', async () => {
  const context = { age: 19, userId: 'admin' };
  const result = await all(isOver18, hasPermission)(context);
  expect(result).toBe(true);
});

test('should fail when one condition is false', async () => {
  const context = { age: 17, userId: 'user' };
  const result = await all(isOver18, hasPermission)(context);
  expect(result).toBe(false);
});
