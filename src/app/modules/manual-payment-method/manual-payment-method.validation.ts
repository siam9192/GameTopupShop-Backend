import { z } from 'zod';
import { ManualPaymentMethodStatus } from './manual-payment-method.interface';

const createManualPaymentMethodValidation = z.object({
  name: z.string().nonempty().max(50),
  logo: z.string().url(),
  numbers: z.array(z.string()).min(1).max(10),
});

const updateManualPaymentMethodValidation = createManualPaymentMethodValidation.partial();

const updateManualPaymentMethodStatusValidation = z.object({
  id: z.string(),
  status: z.enum([ManualPaymentMethodStatus.ACTIVE, ManualPaymentMethodStatus.INACTIVE]),
});

const manualPaymentMethodValidations = {
  createManualPaymentMethodValidation,
  updateManualPaymentMethodValidation,
  updateManualPaymentMethodStatusValidation,
};

export default manualPaymentMethodValidations;
