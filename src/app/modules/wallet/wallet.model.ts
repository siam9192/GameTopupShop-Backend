import { model, Schema } from 'mongoose';
import { Wallet } from './wallet.interface';

const WalletModelSchema = new Schema<Wallet>(
  {
    customerId: {
      type: Schema.ObjectId,
      ref: 'Customer',
      required: true,
    },
    balance: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WalletModel = model<Wallet>('Wallet', WalletModelSchema);

export default WalletModel;
