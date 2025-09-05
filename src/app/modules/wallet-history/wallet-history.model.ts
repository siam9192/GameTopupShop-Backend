import { model, Schema } from 'mongoose';
import { WalletHistory, WalletHistoryType } from './wallet-history.interface';

const WalletHistoryModelSchema = new Schema<WalletHistory>(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    prevBalance: {
      type: Number,
      min: 0,
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(WalletHistoryType),
      required: true,
    },
  },
  { timestamps: true }
);

const WalletHistoryModel = model<WalletHistory>('WalletHistory', WalletHistoryModelSchema);

export default WalletHistoryModel;
