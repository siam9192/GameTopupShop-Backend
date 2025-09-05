import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import walletHistoryController from './wallet-history.controller';

const router = Router();

router.get('/', auth(UserRole.CUSTOMER), walletHistoryController.getMyWalletHistories);

router.get('/:id', auth(UserRole.CUSTOMER), walletHistoryController.getWalletHistoryById);

const walletHistory = router;

export default walletHistory;
