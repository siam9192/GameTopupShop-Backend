import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import validateRequest from '../../middlewares/validateRequest';
import appSettingValidations from './app-setting.validation';
import appSettingController from './app-setting.controller';
import { ALL_ADMINISTRATOR_LEVELS } from '../../utils/constant';

const router = Router();

router.put(
  '/',
  auth(UserRole.SUPER_ADMIN),
  validateRequest(appSettingValidations.updateAppSettingValidation),
  appSettingController.updateAppSetting
);

router.get('/', auth(...ALL_ADMINISTRATOR_LEVELS), appSettingController.getAppSetting);

const appSettingRouter = router;
export default appSettingRouter;
