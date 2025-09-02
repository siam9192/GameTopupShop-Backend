import { Router } from 'express';

import auth from '../../middlewares/auth';
import { AdministratorLevel } from '../user/user.interface';
import manualPaymentMethodController from './manual-payment-method.controller';
import validateRequest from '../../middlewares/validateRequest';
import manualPaymentMethodValidations from './manual-payment-method.validation';

const router = Router();

router.get('/', auth(Object.values(AdministratorLevel)), manualPaymentMethodController.getMethods);
router.get('/public', manualPaymentMethodController.getPublicPaymentMethods);
router.get(
  '/:id',
  auth(Object.values(AdministratorLevel)),
  manualPaymentMethodController.getMethodById
);

router.post(
  '/',
  auth(Object.values(AdministratorLevel)),
  validateRequest(manualPaymentMethodValidations.createManualPaymentMethodValidation),
  manualPaymentMethodController.createMethod
);
router.put(
  '/',
  auth(Object.values(AdministratorLevel)),
  validateRequest(manualPaymentMethodValidations.updateManualPaymentMethodValidation),
  manualPaymentMethodController.updateMethod
);
router.patch(
  '/',
  auth(Object.values(AdministratorLevel)),
  validateRequest(manualPaymentMethodValidations.updateManualPaymentMethodStatusValidation),
  manualPaymentMethodController.updateMethodStatus
);
router.delete(
  '/',
  auth(Object.values(AdministratorLevel)),
  manualPaymentMethodController.softDeleteMethod
);

const manualPaymentMethodRouter = router;

export default manualPaymentMethodRouter;
