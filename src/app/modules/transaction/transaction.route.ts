import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ALL_ADMINISTRATOR_LEVELS, ALL_ROLES } from '../../utils/constant';
import transactionController from './transaction.controller';
import { AdministratorLevel, UserRole } from '../user/user.interface';
import validateRequest from '../../middlewares/validateRequest';
import transactionValidations from './transaction.validation';

const router = Router();

router.get('/', auth(...ALL_ADMINISTRATOR_LEVELS), transactionController.getTransactions);
router.get('/my', auth(UserRole.CUSTOMER), transactionController.getMyTransactions);
router.get('/:id', auth(...ALL_ROLES), transactionController.getTransactionById);

router.post(
  '/live-payment',
  auth(UserRole.CUSTOMER),
  validateRequest(transactionValidations.makeOrderLivePaymentValidation),
  transactionController.makeOrderLivePayment
);

router.post(
  '/wallet-payment',
  auth(UserRole.CUSTOMER),
  validateRequest(transactionValidations.makeOrderWalletPaymentValidation),
  transactionController.makeOrderWalletPayment
);

router.patch(
  '/status',
  auth(AdministratorLevel.SUPER_ADMIN),
  validateRequest(transactionValidations.updateTransactionStatusValidation),
  transactionController.updateTransactionStatus
);

const transactionRouter = router;
export default transactionRouter;
