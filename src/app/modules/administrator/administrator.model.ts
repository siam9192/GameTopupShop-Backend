import { Model, model, now, Schema, Types } from 'mongoose';
import { AccountStatus, AdministratorLevel } from '../user/user.interface';
import { Administrator } from './administrator.interface';
import { DEFAULT_SUPER_ADMIN } from '../../utils/constant';
import bycryptHelpers from '../../helpers/bycryptHelpers';

const AdministratorModelSchema = new Schema<Administrator>(
  {
    name: {
      type: new Schema(
        {
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
        { _id: false }
      ),
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
      enum: Object.values(AdministratorLevel),
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
      default: null,
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
AdministratorModelSchema.statics.ensureDefault = async function () {
  const count = await this.countDocuments({ level: AdministratorLevel.SUPER_ADMIN });
  if (count === 0) {
    this.create({
      name: {
        first: 'Arafat Hasan',
        last: 'Siam',
      },
      fullName: 'Arafat Hasan Siam',
      level: AdministratorLevel.SUPER_ADMIN,
      profilePicture:
        'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
      password: await bycryptHelpers.hash('123456'),
      email: 'superadmin@gmail.com',
      status: AccountStatus.ACTIVE,
    });
  }
  return null;
};

export interface CurrencyModelType extends Model<Administrator> {
  ensureDefault(): Promise<Administrator>;
}

const AdministratorModel = model<Administrator, CurrencyModelType>(
  'Administrator',
  AdministratorModelSchema
);
export default AdministratorModel;
