import { model, Schema } from 'mongoose';
import {
  Topup,
  TopupInfoField,
  TopupInfoFieldType,
  TopupPackage,
  TopupPackageStatus,
  TopupStatus,
} from './topup.interface';

const InfoFieldSchema = new Schema<TopupInfoField>(
  {
    name: { type: String, required: true },
    placeholder: { type: String, default: null },
    type: { type: String, enum: Object.values(TopupInfoFieldType), required: true },
    minLength: { type: Number, default: null },
    maxLength: { type: Number, default: null },
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    optional: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const TopupPackageSchema = new Schema<TopupPackage>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: Object.values(TopupPackageStatus), required: true },
});

const TopupModelSchema: Schema<Topup> = new Schema({
  name: { type: String, required: true },
  platformName: { type: String, required: true },
  startFrom: { type: Number, required: true },
  packages: { type: [TopupPackageSchema], required: true, minlength: 1 },
  coverPhoto: { type: String, required: true },
  description: { type: String, required: true },
  infoFields: { type: [InfoFieldSchema], required: true },
  status: {
    type: String,
    enum: Object.values(TopupStatus),
    default: TopupStatus.ACTIVE,
    required: true,
  },
});

const TopupModel = model<Topup>('Topup', TopupModelSchema);

export default TopupModel;
