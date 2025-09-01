import { model, now, Schema, Types } from 'mongoose';
import { AccountStatus, AdministratorLevel } from '../User/user.interface';
import { Administrator } from './administrator.interface';

const AdministratorModelSchema = new Schema<Administrator>(
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
      required: true,
      minLength: 1,
      trim: true,
    },
    level: {
      type: String,
      enum: AdministratorLevel,
      required: true,
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
