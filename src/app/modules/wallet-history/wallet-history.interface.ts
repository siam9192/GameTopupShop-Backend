import { Types } from 'mongoose';

export interface WalletHistory extends Document {
  walletId: Types.ObjectId;
  prevBalance: number;
  amount: number;
  type: WalletHistoryType;
  createdAt: Date;
  updatedAt: Date;
}

export enum WalletHistoryType {
  CREDIT = 'Credit',
  DEBIT = 'Debit',
}

export interface WalletHistoryFilterPayload {}
