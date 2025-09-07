import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ALL_ADMINISTRATOR_LEVELS, ALL_ROLES } from '../../utils/constant';
import { UserRole } from '../user/user.interface';
import orderController from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import orderValidations from './order.validation';

const router = Router();

router.get('/', auth(...ALL_ADMINISTRATOR_LEVELS), orderController.getOrders);
router.get('/my', auth(UserRole.CUSTOMER), orderController.getMyOrders);
router.get('/:id', auth(...ALL_ROLES), orderController.getOrderById);

router.post('/', auth(UserRole.CUSTOMER), orderController.createOrder);
router.patch(
  '/status',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(orderValidations.updateOrderStatusValidation),
  orderController.updateOrderStatus
);

const orderRouter = router;
export default orderRouter;
