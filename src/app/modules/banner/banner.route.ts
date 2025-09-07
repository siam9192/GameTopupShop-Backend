import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import bannerValidations from './banner.validation';

import bannerController from './banner.controller';
import auth from '../../middlewares/auth';

import { UserRole } from '../user/user.interface';

const router = Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(bannerValidations.createBannerValidation),
  bannerController.createBanner
);
router.put(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(bannerValidations.updateBannerValidation),
  bannerController.updateBanner
);
router.delete('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), bannerController.deleteBanner);

router.get('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), bannerController.getBanners);
router.get('/public', bannerController.getPublicBanners);
router.get('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), bannerController.getBannerById);

const bannerRouter = router;
export default bannerRouter;
