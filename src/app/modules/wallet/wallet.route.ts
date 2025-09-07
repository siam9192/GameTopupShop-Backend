import { Router } from 'express';
import { AdministratorLevel, UserRole } from '../user/user.interface';
import auth from '../../middlewares/auth';
import walletController from './wallet.controller';
import validateRequest from '../../middlewares/validateRequest';
import walletValidations from './wallet.validation';

const router = Router();

router.get(
  '/',
  auth(AdministratorLevel.ADMIN, AdministratorLevel.SUPER_ADMIN),
  walletController.getWallets
);
router.get(
  '/:id',
  auth(AdministratorLevel.ADMIN, AdministratorLevel.SUPER_ADMIN),
  walletController.getWalletById
);
router.get(
  '/customer/:id',
  auth(AdministratorLevel.ADMIN, AdministratorLevel.SUPER_ADMIN),
  walletController.getWalletById
);
router.get('/my', auth(UserRole.CUSTOMER), walletController.getMyWallet);
router.patch(
  '/balance',
  auth(AdministratorLevel.SUPER_ADMIN),
  validateRequest(walletValidations.updateWalletBalanceValidation),
  walletController.updateWalletBalance
);
const walletRouter = router;

export default walletRouter;
