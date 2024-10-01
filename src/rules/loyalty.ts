import { all, StatefulRule, StatelessRule } from "./types";

export interface Item {
  sku: string;
  quantity: number;
  discount: number;
  price: number;
}

export interface OrderData {
  items: Item[];
  transactionDate: Date;
  paymentMethod: string;
}

export interface LoyaltyContext {
  customerId: string;
  eventName: string;
  eventType: string;
  orderData: OrderData;
}


export const includeSkuRule = (includeSkuList: string[]): StatelessRule<LoyaltyContext> => (context) =>
  context.orderData.items.some(item => includeSkuList.includes(item.sku));

export const excludeSkuRule = (excludeSkuList: string[]): StatelessRule<LoyaltyContext> => (context) =>
  !context.orderData.items.some(item => excludeSkuList.includes(item.sku));

export const includeCustomerRule = (includeCustomerList: string[]): StatelessRule<LoyaltyContext> => (context) =>
  includeCustomerList.includes(context.customerId);

export const excludeCustomerRule = (excludeCustomerList: string[]): StatelessRule<LoyaltyContext> => (context) =>
  !excludeCustomerList.includes(context.customerId);

export const minimumPurchaseRule = (minAmount: number): StatelessRule<LoyaltyContext> => (context) => {
  const total = context.orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return total >= minAmount;
};

export const fetchRedemptionData = async (customerId: string): Promise<boolean> => {
  // Simulated database call to check if the customer has already redeemed
  // Let's assume that it returns true if the customer has already redeemed
  return new Promise(resolve => {
    setTimeout(() => resolve(false), 500);  // Example with no redemption
  });
};

export const onlyOnePerCustomerRule: StatefulRule<LoyaltyContext> = async (context) => {
  const alreadyRedeemed = await fetchRedemptionData(context.customerId);
  return !alreadyRedeemed;
};


export const validateLoyalty = all(
  includeSkuRule(['sku1', 'sku2']),    // Only include specific SKUs
  excludeSkuRule(['sku3']),            // Exclude certain SKUs
  includeCustomerRule(['customer1']),  // Only include certain customers
  excludeCustomerRule(['customer2']),  // Exclude certain customers
  minimumPurchaseRule(100),            // Minimum purchase of $100
  onlyOnePerCustomerRule               // Only one redemption per customer
);

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

(async () => {
  const isEligible = await validateLoyalty(loyaltyContext);
  console.log(isEligible ? 'Eligible for loyalty program' : 'Not eligible for loyalty program');
})();
