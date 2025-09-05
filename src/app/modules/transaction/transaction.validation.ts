import { z } from 'zod';
import { LivePaymentMethod, TransactionStatus } from './transaction.interface';

const updateTransactionStatusValidation = z.object({
  id: z.string().nonempty(),
  status: z.nativeEnum(TransactionStatus),
});

const makeOrderWalletPaymentValidation = z.object({
  orderId: z.string().nonempty(),
});

const makeOrderLivePaymentValidation = z.object({
  orderId: z.string().nonempty(),
  method: z.nativeEnum(LivePaymentMethod),
});

const transactionValidations = {
  updateTransactionStatusValidation,
  makeOrderLivePaymentValidation,
  makeOrderWalletPaymentValidation,
};

export default transactionValidations;
