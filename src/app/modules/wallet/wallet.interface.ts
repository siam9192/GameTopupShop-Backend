import { Types } from 'mongoose';

export interface IWalletHistory {
  _id: Types.ObjectId;
  walletId: Types.ObjectId;
  title: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  _id: Types.ObjectId;
  customerId: Types.ObjectId;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletsFilterPayload
  extends Partial<{
    searchTerm: string;
    name: string;
    email: string;
    minBalance: string;
    maxBalance: string;
  }> {}
export interface UpdateWalletBalancePayload {
  id: string;
  balance: number;
}
