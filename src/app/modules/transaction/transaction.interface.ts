import { Document, Types } from 'mongoose';
import { Customer } from '../customer/customer.interface';

export interface Transaction extends Document {
  customerId: Types.ObjectId | Customer;
  orderId: Types.ObjectId;
  amount: number;
  currency: string;
  type: TransactionType;
  method: PaymentMethod;
  reference?: string;
  description?: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionType {
  CREDIT = 'Credit', // money added
  DEBIT = 'Debit', // money deducted
}

export enum TransactionCategory {
  WALLET = 'Wallet',
  ORDER = 'Order',
  REFUND = 'Refund',
  PAYMENT = 'Payment',
  ADJUSTMENT = 'Adjustment', // manual admin adjustment
}

export enum TransactionStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAILED = 'Failed',
}

export enum PaymentMethod {
  WALLET = 'Wallet',
  CARD = 'Card',
  CASH = 'Cash',
  GATEWAY = 'Gateway', // online payment (Stripe, SSLCommerz, bKash, etc.)
}

export interface TransactionsFilterPayload
  extends Partial<{
    id: string;
    orderId: string;
    customerId: string;
    method: PaymentMethod;
    status: TransactionStatus;
    minAmount: string;
    maxAmount: string;
  }> {}

export interface UpdateTransactionStatusPayload {
  id: string;
  status: TransactionStatus;
}

export interface MakeOrderLivePaymentPayload {
  orderId: string;
  method: LivePaymentMethod;
}

export interface MakeWalletPaymentPayload {
  orderId: string;
}

export enum LivePaymentMethod {
  SSLCOMMERZ = 'Sslcommerz',
  STRIPE = 'Stripe',
}
