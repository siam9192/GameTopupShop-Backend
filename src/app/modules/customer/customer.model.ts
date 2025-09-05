import { model, now, Schema, Types } from 'mongoose';
import { Customer } from './customer.interface';
import { AccountStatus } from '../user/user.interface';

const CustomerModelSchema = new Schema<Customer>(
  {
    name: {
      type: {
        first: {
          type: String,
          required: true,
          minLength: 1,
          maxLength: 25,
          trim: true,
        },
        last: {
          type: String,
          required: true,
          minLength: 1,
          maxLength: 25,
          trim: true,
        },
      },
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
      trim: true,
    },
    profilePicture: {
      type: String,
      minLength: 1,
      trim: true,
      default: null,
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
    phone: {
      type: String,
      minlength: 1,
      default: null,
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
      select: false,
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
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const CustomerModel = model<Customer>('Customer', CustomerModelSchema);
export default CustomerModel;
