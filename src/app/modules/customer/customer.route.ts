import { Router } from 'express';
import auth from '../../middlewares/auth';
import customerController from './customer.controller';
import { ALL_ADMINISTRATOR_LEVELS } from '../../utils/constant';

const router = Router();

router.get('/', auth(...ALL_ADMINISTRATOR_LEVELS), customerController.getCustomers);
router.get('/:id', auth(...ALL_ADMINISTRATOR_LEVELS), customerController.getCustomerById);
router.patch('/status', auth(...ALL_ADMINISTRATOR_LEVELS), customerController.changeCustomerStatus);
const customerRouter = router;

export default customerRouter;
