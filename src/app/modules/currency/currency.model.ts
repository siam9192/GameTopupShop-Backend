import { Model, Schema, model } from 'mongoose';
import { Currency, CurrencyStatus } from './currency.interface'; // adjust path if needed
import { DEFAULT_CURRENCIES } from '../../utils/constant';

// ---------------- Schema ----------------
const CurrencyModelSchema = new Schema<Currency>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // ISO codes like "USD", "BDT"
    },
    symbol: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CurrencyStatus),
      default: CurrencyStatus.ACTIVE,
    },
  },
  { timestamps: true } // auto add createdAt, updatedAt
);

CurrencyModelSchema.statics.ensureDefault = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    this.create(DEFAULT_CURRENCIES);
  }
  return null;
};

export interface CurrencyModelType extends Model<Currency> {
  ensureDefault(): Promise<Currency>;
}

// ---------------- Model ----------------
const CurrencyModel = model<Currency, CurrencyModelType>('Currency', CurrencyModelSchema);

export default CurrencyModel;
