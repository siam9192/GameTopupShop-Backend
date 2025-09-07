import { Router } from 'express';
import auth from '../../middlewares/auth';
import { AdministratorLevel, UserRole } from '../user/user.interface';
import validateRequest from '../../middlewares/validateRequest';
import walletSubmissionValidations from './wallet-submission.validation';
import walletSubmissionController from './wallet-submission.controller';

const router = Router();

router.post(
  '/',
  auth(UserRole.CUSTOMER),
  validateRequest(walletSubmissionValidations.createWalletSubmissionValidation),
  walletSubmissionController.createWalletSubmission
);

router.patch(
  '/:id/approve',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  walletSubmissionController.approveWalletSubmission
);

router.patch(
  '/:id/decline',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(walletSubmissionValidations.declineWalletSubmissionValidation),
  walletSubmissionController.declineWalletSubmission
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  walletSubmissionController.getWalletSubmissions
);

router.get('/my', auth(UserRole.CUSTOMER), walletSubmissionController.getMyWalletSubmissions);

router.get(
  '/:id',
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  walletSubmissionController.getWalletSubmissionById
);

const walletSubmissionRouter = router;

export default walletSubmissionRouter;
