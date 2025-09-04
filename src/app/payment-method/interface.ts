export interface IPaymentMethodData {
  transactionId: string;
  currency: string;
  service_name: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
}
