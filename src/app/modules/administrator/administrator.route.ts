import { Router } from 'express';
import auth from '../../middlewares/auth';
import { AdministratorLevel } from '../user/user.interface';
import validateRequest from '../../middlewares/validateRequest';
import administratorValidations from './administrator.validation';
import administratorController from './administrator.controller';

const router = Router();

router.post(
  '/',
  auth(AdministratorLevel.SUPER_ADMIN),
  validateRequest(administratorValidations.createAdministratorValidation),
  administratorController.createAdministrator
);

router.patch(
  '/level',
  auth(AdministratorLevel.SUPER_ADMIN),
  validateRequest(administratorValidations.updateAdministratorLevelIntoDB),
  administratorController.updateAdministratorLevel
);

router.patch(
  '/status',
  auth(AdministratorLevel.SUPER_ADMIN),
  validateRequest(administratorValidations.updateAdministratorStatusIntoDB),
  administratorController.updateAdministratorStatus
);

router.delete(
  '/:id',
  auth(AdministratorLevel.SUPER_ADMIN),
  administratorController.softDeleteAdministrator
);

router.get('/', auth(AdministratorLevel.SUPER_ADMIN), administratorController.getAdministrators);
router.get(
  '/:id',
  auth(AdministratorLevel.SUPER_ADMIN),
  administratorController.getAdministratorById
);

const administratorRouter = router;
export default administratorRouter;
