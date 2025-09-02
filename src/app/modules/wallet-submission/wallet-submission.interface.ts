import { Types } from 'mongoose';

export interface WalletSubmission {
  customerId: Types.ObjectId;
  methodId: Types.ObjectId;
  methodName: string;
  number: string;
  transactionId:string
  amount: number;
  note: string;
  declineReason?: string;
  status: WalletSubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum WalletSubmissionStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DECLINED = 'Declined',
}

export type CreateWalletSubmissionPayload = Pick<
  WalletSubmission,
  'methodId' | 'number' | 'amount' | 'note'
>;

export type DeclineWalletSubmissionPayload = {
  declineReason: string;
};

export type WalletSubmissionsFilterPayload = Partial<{
  searchTerm: string;
  customerId: string;
  methodName: string;
  minAmount: string | number;
  maxAmount: string | number;
  status: WalletSubmissionStatus;
}>;
