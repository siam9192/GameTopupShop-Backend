import { z } from 'zod';
import { CurrencyStatus } from './currency.interface';

const createCurrencyValidation = z.object({
  name: z.string(),
  code: z.string(),
  symbol: z.string().min(1, 'Symbol is required'),
  status: z.nativeEnum(CurrencyStatus).optional(),
});

const updateCurrencyValidation = createCurrencyValidation.partial();

const currencyValidations = {
  createCurrencyValidation,
  updateCurrencyValidation,
};

export default currencyValidations;
