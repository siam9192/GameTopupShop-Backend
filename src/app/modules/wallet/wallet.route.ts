import { Router } from 'express';
import { AdministratorLevel, UserRole } from '../user/user.interface';
import auth from '../../middlewares/auth';
import walletController from './wallet.controller';
import validateRequest from '../../middlewares/validateRequest';
import walletValidations from './wallet.validation';
import { ALL_ADMINISTRATOR_LEVELS } from '../../utils/constant';

const router = Router();

router.get('/', auth(...ALL_ADMINISTRATOR_LEVELS), walletController.getWalletByCustomerId);
router.get('/:id', auth(...ALL_ADMINISTRATOR_LEVELS), walletController.getWalletById);

router.get('/customer/:id', auth(...ALL_ADMINISTRATOR_LEVELS), walletController.getWalletById);

router.get('/my', auth(UserRole.CUSTOMER), walletController.getMyWallet);

router.patch(
  '/balance',
  auth(Object.values(AdministratorLevel)),
  validateRequest(walletValidations.updateWalletBalanceValidation),
  walletController.updateWalletBalance
);
const walletRouter = router;

export default walletRouter;
