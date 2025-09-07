import e from 'express';
import { z } from 'zod';

const createWalletSubmissionValidation = z.object({
  methodId: z.string().nonempty(),
  number: z.string().nonempty(),
  amount: z.number().min(0),
  transactionId: z.string().nonempty(),
  note: z.string().optional(),
});

const declineWalletSubmissionValidation = z.object({
  declineReason: z.string().nonempty(),
});

const walletSubmissionValidations = {
  createWalletSubmissionValidation,
  declineWalletSubmissionValidation,
};

export default walletSubmissionValidations;
