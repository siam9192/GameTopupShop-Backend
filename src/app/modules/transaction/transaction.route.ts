import { Router } from 'express';
import auth from '../../middlewares/auth';
import transactionController from './transaction.controller';
import { UserRole } from '../user/user.interface';
import validateRequest from '../../middlewares/validateRequest';
import transactionValidations from './transaction.validation';

const router = Router();

router.get('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), transactionController.getTransactions);
router.get('/my', auth(UserRole.CUSTOMER), transactionController.getMyTransactions);
router.get(
  '/:id',
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  transactionController.getTransactionById
);

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
  auth(UserRole.SUPER_ADMIN),
  validateRequest(transactionValidations.updateTransactionStatusValidation),
  transactionController.updateTransactionStatus
);

const transactionRouter = router;
export default transactionRouter;
