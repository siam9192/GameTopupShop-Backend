import { Router } from 'express';
import auth from '../../middlewares/auth';
import { AdministratorLevel, UserRole } from '../user/user.interface';
import CustomerValidation from './customer.validation';
import validateRequest from '../../middlewares/validateRequest';
import customerController from './customer.controller';

const router = Router();

router.get('/', auth(Object.values(AdministratorLevel)), customerController.getCustomers);
router.get('/:id', auth(Object.values(AdministratorLevel)), customerController.getCustomerById);
router.patch(
  '/status',
  auth(Object.values(AdministratorLevel)),
  customerController.changeCustomerStatus
);
const customerRouter = router;

export default customerRouter;
