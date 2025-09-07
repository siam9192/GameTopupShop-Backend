import { Router } from 'express';

import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import manualPaymentMethodController from './manual-payment-method.controller';
import validateRequest from '../../middlewares/validateRequest';
import manualPaymentMethodValidations from './manual-payment-method.validation';

const router = Router();

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  manualPaymentMethodController.getMethods
);
router.get('/public', manualPaymentMethodController.getPublicPaymentMethods);
router.get(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  manualPaymentMethodController.getMethodById
);

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(manualPaymentMethodValidations.createManualPaymentMethodValidation),
  manualPaymentMethodController.createMethod
);
router.put(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(manualPaymentMethodValidations.updateManualPaymentMethodValidation),
  manualPaymentMethodController.updateMethod
);
router.patch(
  '/status',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(manualPaymentMethodValidations.updateManualPaymentMethodStatusValidation),
  manualPaymentMethodController.updateMethodStatus
);
router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  manualPaymentMethodController.softDeleteMethod
);

const manualPaymentMethodRouter = router;

export default manualPaymentMethodRouter;
