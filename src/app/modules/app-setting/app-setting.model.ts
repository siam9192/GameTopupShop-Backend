import { Schema, model, Document, Types, Model } from 'mongoose';
import { AppSetting, AppStatus } from './app-setting.interface';
import e from 'express';
import { DEFAULT_APP_SETTING } from '../../utils/constant';

const AppSettingModelSchema = new Schema<AppSetting>(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    favicon: { type: String },
    description: { type: String },

    supportEmail: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    address: { type: String, default: null },
    currency: { type: String, default: null },
    timezone: { type: String, default: null },
    language: { type: String, default: null },

    socialLinks: {
      facebook: { type: String, default: null },
      twitter: { type: String, default: null },
      instagram: { type: String, default: null },
      linkedin: { type: String, default: null },
      youtube: { type: String, default: null },
    },

    notification: {
      type: new Schema(
        {
          enableCustomerNotification: { type: Boolean, default: true },
          enableAdministratorNotification: { type: Boolean, default: true },
        },
        { _id: false }
      ),
      required: true,
    },

    order: {
      type: new Schema({
        enableTopupOrder: { type: Boolean, default: true },
        enableOfferOrder: { type: Boolean, default: true },
      }),
      required: true,
    },

    wallet: {
      type: new Schema({
        enableAddBalance: { type: Boolean, default: true },
        enableWalletSubmission: { type: Boolean, default: true },
      }),
      required: true,
    },
    appStatus: {
      type: String,
      enum: Object.values(AppStatus),
      default: AppStatus.OPEN,
    },
  },
  { timestamps: true } // auto createdAt, updatedAt
);

AppSettingModelSchema.statics.ensureDefault = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    return this.create(DEFAULT_APP_SETTING);
  }
  return this.findOne();
};
export interface AppSettingModelType extends Model<AppSetting> {
  ensureDefault(): Promise<AppSetting>;
}

const AppSettingModel = model<AppSetting, AppSettingModelType>('AppSetting', AppSettingModelSchema);

export default AppSettingModel;
