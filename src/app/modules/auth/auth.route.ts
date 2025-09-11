import { Router } from 'express';
import authController from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import authValidations from './auth.validation';
import auth from '../../middlewares/auth';
import { ALL_ROLES } from '../../utils/constant';

const router = Router();

router.post(
  '/signup',
  validateRequest(authValidations.customerSignupValidation),
  authController.customerSignUp
);

router.post(
  '/signin',
  validateRequest(authValidations.customerSignInValidation),
  authController.customerSignin
);

router.post(
  '/administrator-signin',
  validateRequest(authValidations.customerSignInValidation),
  authController.administratorSignin
);

router.post('/callback', authController.callback);

router.patch(
  '/change-password',
  auth(...ALL_ROLES),
  validateRequest(authValidations.changePasswordValidation),
  authController.changePassword
);

router.get('/access-token', authController.getNewAccessToken);

const authRouter = router;

export default authRouter;
