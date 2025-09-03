import { z } from 'zod';
import { TransactionStatus } from './transaction.interface';

const updateTransactionStatusValidation = z.object({
  id: z.string().nonempty(),
  status: z.nativeEnum(TransactionStatus),
});

const transactionValidations = {
  updateTransactionStatusValidation,
};

export default transactionValidations;
