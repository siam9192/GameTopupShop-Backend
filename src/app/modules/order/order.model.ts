import { Schema, model, Types, Document } from 'mongoose';
import { Order, OrderStatus, PaymentStatus, ProductCategory } from './order.interface';

const OrderModelSchema = new Schema<Order>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    product: {
      type: new Schema(
        {
          productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
          name: { type: String, required: true },
          package: { type: String, default: null },
          category: {
            type: String,
            enum: Object.values(ProductCategory),
            required: true,
          },
          image: { type: String, required: true },
          price: { type: Number, min: 0, required: true },
          quantity: { type: Number, required: true, min: 1 },
        },
        { _id: false }
      ),
      required: true,
    },
    fieldsInfo: {
      type: [
        new Schema({
          name: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        }),
      ],
      required: true,
    },
    payment: {
      type: new Schema({
        transactionId: {
          type: Schema.Types.ObjectId,
          ref: 'Transaction',
          default: null,
        },
        amount: { type: Number, required: true },
        status: {
          type: String,
          enum: Object.values(PaymentStatus),
          default: PaymentStatus.UNPAID,
        },
      }),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = model<Order>('Order', OrderModelSchema);
export default OrderModel;
