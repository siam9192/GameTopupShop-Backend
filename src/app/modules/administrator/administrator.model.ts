import { model, now, Schema, Types } from 'mongoose';
import { AccountStatus } from '../User/user.interface';
import { Administrator } from './administrator.interface';

const AdministratorModelSchema = new Schema<Administrator>(
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

const AdministratorModel = model<Administrator>('Administrator', AdministratorModelSchema);
export default AdministratorModel;
