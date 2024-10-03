import { all, RuleEngine, StatelessRule, StatefulRule, Action } from '../engine';

// Define the Loyalty Context structure
export interface Item {
  itemCode: string;
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

// Define rules as stateless and stateful rules
export const includeSkuRule = (includeSkuList: string[]): StatelessRule<LoyaltyContext> => (context) =>
  context.orderData.items.some(item => includeSkuList.includes(item.itemCode));

export const excludeSkuRule = (excludeSkuList: string[]): StatelessRule<LoyaltyContext> => (context) =>
  !context.orderData.items.some(item => excludeSkuList.includes(item.itemCode));

export const includeCustomerRule = (includeCustomerList: string[]): StatelessRule<LoyaltyContext> => (context) =>
  includeCustomerList.includes(context.customerId);

export const excludeCustomerRule = (excludeCustomerList: string[]): StatelessRule<LoyaltyContext> => (context) =>
  !excludeCustomerList.includes(context.customerId);

export const minimumPurchaseRule = (minAmount: number): StatelessRule<LoyaltyContext> => (context) => {
  const total = context.orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return total >= minAmount;
};

// Simulated database call to check if the customer has already redeemed
export const fetchRedemptionData = async (customerId: string): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(false), 500); // Assume the customer has not redeemed yet
  });
};

export const onlyOnePerCustomerRule: StatefulRule<LoyaltyContext> = async (context) => {
  const alreadyRedeemed = await fetchRedemptionData(context.customerId);
  return !alreadyRedeemed;
};
