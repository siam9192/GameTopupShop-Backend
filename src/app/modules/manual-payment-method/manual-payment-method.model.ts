import { model, Schema } from 'mongoose';
import { ManualPaymentMethod, ManualPaymentMethodStatus } from './manual-payment-method.interface';

const ManualPaymentMethodModelSchema = new Schema<ManualPaymentMethod>(
  {
    name: {
      type: String,
      minlength: 1,
      trim: true,
      maxlength: 50,
      required: true,
    },
    logo: {
      type: String,
      minlength: 1,
      trim: true,
      required: true,
    },
    numbers: {
      type: [String],
      minlength: 1,
      maxlength: 10,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ManualPaymentMethodStatus),

      required: true,
    },
  },
  { timestamps: true }
);

const ManualPaymentMethodModel = model<ManualPaymentMethod>(
  'ManualPaymentMethod',
  ManualPaymentMethodModelSchema
);

export default ManualPaymentMethodModel;
