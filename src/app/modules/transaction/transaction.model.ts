import mongoose, { Schema, model } from 'mongoose';
import {
  PaymentMethod,
  Transaction,
  TransactionStatus,
  TransactionType,
} from './transaction.interface';

const TransactionModelSchema: Schema = new Schema<Transaction>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },

    amount: { type: Number, required: true },
    currency: { type: String, required: true },

    type: { type: String, enum: Object.values(TransactionType), required: true },
    method: { type: String, enum: Object.values(PaymentMethod), required: true },
    reference: { type: String },
    description: { type: String },

    status: { type: String, enum: Object.values(TransactionStatus), required: true },
  },
  {
    timestamps: true,
  }
);

const TransactionModel = model<Transaction>('Transaction', TransactionModelSchema);
export default TransactionModel;
