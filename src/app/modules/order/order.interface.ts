import { Types } from 'mongoose';

export interface Order extends Document {
  customerId: Types.ObjectId;
  product: OrderProduct;
  fieldsInfo: FieldInfo[];
  payment: OrderPayment;
  status: OrderStatus;
}

export type OrderProduct = {
  productId: Types.ObjectId;
  name: string;
  package?: string;
  category: ProductCategory;
  image: string;
  price: number;
  quantity: number;
};

export type FieldInfo = {
  name: string;
  value: string;
}[];

export type OrderPayment = {
  transactionId?: Types.ObjectId;
  amount: number;
  status: PaymentStatus;
};

export enum ProductCategory {
  TOP_UP = 'Topup',
  OFFER = 'Offer',
}

export enum OrderStatus {
  PENDING = 'Pending',
  RUNNING = 'Running',
  COMPLETED = 'Completed',
  REFUNDED = 'Refunded',
  FAILED = 'Failed',
}

export enum PaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
}

export interface CreateOrderPayload {
  productId: string;
  packageId?: string;
  category: ProductCategory;
  quantity: number;
  fieldsInfo: FieldInfo[];
}

export type OrdersFilterPayload = Partial<{
  id: string;
  searchTerm: string;
  customerId: string;
  minAmount: string;
  maxAmount: string;
  status: OrderStatus;
  category: ProductCategory;
  createdAt: string;
  updatedAt: string;
}>;

export type UpdateOrderStatusPayload = {
  id: string;
  status: OrderStatus;
};
