import { z } from 'zod';
import { CurrencyStatus } from './currency.interface';

const createCurrencyValidation = z.object({
  name: z.string(),
  code: z.string(),
  symbol: z.symbol(),
  status: z.nativeEnum(CurrencyStatus).optional(),
});

const updateCurrencyValidation = createCurrencyValidation.partial();

const currencyValidations = {
  createCurrencyValidation,
  updateCurrencyValidation,
};

export default currencyValidations;
