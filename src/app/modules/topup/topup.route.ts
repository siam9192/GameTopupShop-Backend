import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ALL_ADMINISTRATOR_LEVELS } from '../../utils/constant';
import topupController from './topup.controller';
import topupValidations from './topup.validation';
import validateRequest from '../../middlewares/validateRequest';
const router = Router();

router.post(
  '/',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(topupValidations.createTopupValidation),
  topupController.createTopup
);
router.put(
  '/:id',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(topupValidations.updateTopupValidation),
  topupController.updateTopup
);
router.patch(
  '/status',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(topupValidations.updateTopupStatus),
  topupController.updateTopupStatus
);
router.delete('/:id', topupController.softDeleteTopup);

router.get('/', topupController.getTopups);
router.get('/public', topupController.getPublicTopups);
router.get('/featured', topupController.getFeaturedTopups);
router.get('/:id', topupController.getTopupById);

const topupRouter = router;

export default topupRouter;
