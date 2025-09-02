import { model, Schema } from 'mongoose';
import { WalletSubmission, WalletSubmissionStatus } from './wallet-submission.interface';

const WalletSubmissionModelSchema = new Schema<WalletSubmission>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    methodId: {
      type: Schema.Types.ObjectId,
      ref: 'ManualPaymentMethod',
      required: true,
    },
    methodName: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
     transactionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      maxlength: 2000,
      default: null,
    },

    declineReason: {
      type: String,
      maxlength: 2000,
      default: null,
    },
    status: {
      type: String,
      enum: WalletSubmissionStatus,
      default: WalletSubmissionStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const WalletSubmissionModel = model<WalletSubmission>(
  'WalletSubmission',
  WalletSubmissionModelSchema
);

export default WalletSubmissionModel;
