import type { Action } from "../engine";
import { RuleEngine } from "../engine/RuleEngine";
import {
  type LoyaltyContext,
  includeSkuRule,
  minimumPurchaseRule,
} from "../rules";

// Action to apply discount
const applyDiscountAction: Action<LoyaltyContext> = (context) => {
  const newItems = context.orderData.items.map((item) => ({
    ...item, // Create a new item object
    discount: 10, // Apply a 10% discount
  }));

  return {
    ...context, // Create a new context
    orderData: {
      ...context.orderData,
      items: newItems,
    },
  };
};

// Action to simulate sending a notification (no mutation needed here)
const sendNotificationAction: Action<LoyaltyContext> = async (context) => {
  console.log(`Sending notification to customer ${context.customerId}`);
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return context; // Return the unchanged context
};

describe("Loyalty Rules and Actions", () => {
  let loyaltyContext: LoyaltyContext;

  beforeEach(() => {
    // Define a base context for each test
    loyaltyContext = {
      customerId: "customer1",
      eventName: "Loyalty Program",
      eventType: "Discount",
      orderData: {
        items: [
          { itemCode: "sku1", quantity: 2, discount: 0, price: 50 }, // Total: $100
          { itemCode: "sku4", quantity: 1, discount: 0, price: 30 }, // Not included in SKUs
        ],
        transactionDate: new Date(),
        paymentMethod: "credit-card",
      },
    };
  });

  it("should pass the itemCode inclusion rule", () => {
    const rule = includeSkuRule(["sku1", "sku2"]);
    expect(rule(loyaltyContext)).toBe(true); // sku1 is in the list, so rule should pass
  });

  it("should fail the itemCode inclusion rule for missing SKUs", () => {
    const rule = includeSkuRule(["sku5"]); // itemCode 5 does not exist in the order
    expect(rule(loyaltyContext)).toBe(false);
  });

  it("should pass the minimum purchase rule when the total is above the threshold", () => {
    const rule = minimumPurchaseRule(100); // Minimum purchase is $100
    expect(rule(loyaltyContext)).toBe(true); // Total purchase is $100
  });

  it("should fail the minimum purchase rule when the total is below the threshold", () => {
    const rule = minimumPurchaseRule(200); // Minimum purchase is $200
    expect(rule(loyaltyContext)).toBe(false); // Total purchase is $100
  });

  it("should apply discount when the itemCode rule passes", async () => {
    const engine = new RuleEngine(
      new Map([
        [
          "loyalty",
          [{ rule: includeSkuRule(["sku1"]), action: applyDiscountAction }],
        ],
      ])
    );

    const updatedContext = await engine.runAll(loyaltyContext);

    // Verify that discount was applied to items
    expect(updatedContext.orderData.items[0].discount).toBe(10); // Discount applied to sku1
  });

  it("should send notification when rule passes", async () => {
    const mockSendNotification = jest.fn(sendNotificationAction); // Mock the sendNotification action
    const engine = new RuleEngine(
      new Map([
        [
          "loyalty",
          [{ rule: includeSkuRule(["sku1"]), action: mockSendNotification }],
        ],
      ])
    );

    await engine.runAll(loyaltyContext);

    // Verify that notification action was called
    expect(mockSendNotification).toHaveBeenCalled();
  });

  it("should apply multiple actions when both rules pass", async () => {
    const mockSendNotification = jest.fn(sendNotificationAction); // Mock the sendNotification action

    const engine = new RuleEngine(
      new Map([
        [
          "loyalty",
          [
            { rule: includeSkuRule(["sku1"]), action: applyDiscountAction },
            { rule: minimumPurchaseRule(100), action: mockSendNotification },
          ],
        ],
      ])
    );

    const updatedContext = await engine.runAll(loyaltyContext);

    // Verify that discount was applied and notification was sent
    expect(updatedContext.orderData.items[0].discount).toBe(10); // Discount applied
    expect(mockSendNotification).toHaveBeenCalled(); // Notification action was called
  });
});
