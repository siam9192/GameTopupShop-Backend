import { ObjectId } from 'mongoose';

export interface IWalletHistory {
  _id: ObjectId;
  walletId: ObjectId;
  title: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  _id: ObjectId;
  customerId: ObjectId;
  balance: ObjectId;
  createdAt: string;
  updatedAt: string;
}
