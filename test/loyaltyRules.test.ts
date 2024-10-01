import { includeSkuRule, excludeSkuRule, includeCustomerRule, excludeCustomerRule, minimumPurchaseRule, onlyOnePerCustomerRule, LoyaltyContext } from '../src/rules/loyalty';  // Import your rules

// Mock function for onlyOnePerCustomerRule that simulates async DB check
jest.mock('../src/rules/loyalty', () => ({
  ...jest.requireActual('../src/rules/loyalty'),
  fetchRedemptionData: jest.fn()
}));

describe('Loyalty Rules', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  })
  const loyaltyContext: LoyaltyContext = {
    customerId: 'customer1',
    eventName: 'Loyalty Program',
    eventType: 'Discount',
    orderData: {
      items: [
        { sku: 'sku1', quantity: 2, discount: 10, price: 50 },
        { sku: 'sku4', quantity: 1, discount: 0, price: 30 }
      ],
      transactionDate: new Date(),
      paymentMethod: 'credit-card'
    }
  };

  // Test Include SKU Rule
  test('should validate includeSkuRule - valid SKU', () => {
    const rule = includeSkuRule(['sku1', 'sku2']);
    expect(rule(loyaltyContext)).toBe(true);  // SKU 'sku1' is present
  });

  test('should validate includeSkuRule - invalid SKU', () => {
    const rule = includeSkuRule(['sku3']);
    expect(rule(loyaltyContext)).toBe(false);  // No SKU 'sku3' in the order
  });

  // Test Exclude SKU Rule
  test('should validate excludeSkuRule - valid exclusion', () => {
    const rule = excludeSkuRule(['sku3']);
    expect(rule(loyaltyContext)).toBe(true);  // SKU 'sku3' is not present, so valid
  });

  test('should validate excludeSkuRule - invalid exclusion', () => {
    const rule = excludeSkuRule(['sku1']);
    expect(rule(loyaltyContext)).toBe(false);  // SKU 'sku1' is present, so invalid
  });

  // Test Include Customer Rule
  test('should validate includeCustomerRule - valid customer', () => {
    const rule = includeCustomerRule(['customer1', 'customer2']);
    expect(rule(loyaltyContext)).toBe(true);  // customer1 is included
  });

  test('should validate includeCustomerRule - invalid customer', () => {
    const rule = includeCustomerRule(['customer2']);
    expect(rule(loyaltyContext)).toBe(false);  // customer1 is not included
  });

  // Test Exclude Customer Rule
  test('should validate excludeCustomerRule - valid exclusion', () => {
    const rule = excludeCustomerRule(['customer2']);
    expect(rule(loyaltyContext)).toBe(true);  // customer1 is not excluded
  });

  test('should validate excludeCustomerRule - invalid exclusion', () => {
    const rule = excludeCustomerRule(['customer1']);
    expect(rule(loyaltyContext)).toBe(false);  // customer1 is excluded
  });

  // Test Minimum Purchase Rule
  test('should validate minimumPurchaseRule - valid purchase', () => {
    const rule = minimumPurchaseRule(100);
    expect(rule(loyaltyContext)).toBe(true);  // Total is 130, so valid
  });

  test('should validate minimumPurchaseRule - invalid purchase', () => {
    const rule = minimumPurchaseRule(200);
    expect(rule(loyaltyContext)).toBe(false);  // Total is 130, so invalid
  });

  // Test Only One Per Customer Rule
  test('should validate onlyOnePerCustomerRule - not redeemed', async () => {
    const fetchRedemptionData = require('../src/rules/loyalty').fetchRedemptionData;
    fetchRedemptionData.mockResolvedValueOnce(false);  // Customer has not redeemed yet

    const result = await onlyOnePerCustomerRule(loyaltyContext);
    expect(result).toBe(true);  // Allowed to redeem
  });

  test('should validate onlyOnePerCustomerRule - already redeemed', async () => {
    const fetchRedemptionData = require('../src/rules/loyalty').fetchRedemptionData;
    fetchRedemptionData.mockResolvedValueOnce(true);  // Customer has already redeemed

    const result = await onlyOnePerCustomerRule(loyaltyContext);
    expect(result).toBe(false);  // Not allowed to redeem
  });
});
