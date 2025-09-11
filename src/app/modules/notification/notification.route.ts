import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ALL_ROLES } from '../../utils/constant';
import notificationController from './notification.controller';
import validateRequest from '../../middlewares/validateRequest';
import notificationsValidations from './notification.validation';

const router = Router();

router.get('/my', auth(...ALL_ROLES), notificationController.getMyNotifications);

router.get('/my/unread', auth(...ALL_ROLES), notificationController.getMyUnreadNotifications);

router.patch(
  '/set-read',
  auth(...ALL_ROLES),
  validateRequest(notificationsValidations.notificationsSetAsReadValidation),
  notificationController.notificationsSetAsRead
);

const notificationRouter = router;

export default notificationRouter;
