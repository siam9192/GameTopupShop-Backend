import { model, now, Schema, Types } from 'mongoose';
import { Customer } from './customer.interface';
import { AccountStatus } from '../User/user.interface';

const CustomerModelSchema = new Schema<Customer>(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
      trim: true,
    },
    profilePicture: {
      type: String,
      required: true,
      minLength: 1,
      trim: true,
    },
    wallet: {
      type: Types.ObjectId,
      ref: 'Wallet',
      default: null,
    },
    ordersCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    email: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 100,
      trim: true,
    },
    password: {
      type: String,
      minLength: 1,
      trim: true,
      default: null,
    },
    googleId: {
      type: String,
      minLength: 1,
      trim: true,
      default: null,
    },
    facebookId: {
      type: String,
      minLength: 1,
      trim: true,
      default: null,
    },
    passwordLastChangedAt: {
      type: Date,
      default: now(),
    },
    status: {
      enum: AccountStatus,
      default: AccountStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const CustomerModel = model<Customer>('Wallet', CustomerModelSchema);
export default CustomerModel;
