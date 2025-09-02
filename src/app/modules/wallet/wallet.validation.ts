import { z } from 'zod';

const updateWalletBalanceValidation = z.object({
  id: z.string().nonempty(),
  balance: z.number().min(0),
});

const walletValidations = {
  updateWalletBalanceValidation,
};

export default walletValidations;
