import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import bannerValidations from './banner.validation';

import bannerController from './banner.controller';
import auth from '../../middlewares/auth';
import { ALL_ADMINISTRATOR_LEVELS } from '../../utils/constant';

const router = Router();

router.post(
  '/',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(bannerValidations.createBannerValidation),
  bannerController.createBanner
);
router.put(
  '/',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(bannerValidations.updateBannerValidation),
  bannerController.updateBanner
);
router.delete('/:id', auth(...ALL_ADMINISTRATOR_LEVELS), bannerController.deleteBanner);

router.get('/', auth(...ALL_ADMINISTRATOR_LEVELS), bannerController.getBanners);
router.get('/public', bannerController.getPublicBanners);
router.get('/:id', auth(...ALL_ADMINISTRATOR_LEVELS), bannerController.getBannerById);

const bannerRouter = router;
