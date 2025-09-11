import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ALL_ADMINISTRATOR_LEVELS } from '../../utils/constant';
import offerController from './offer.controller';
import validateRequest from '../../middlewares/validateRequest';
import offerValidations from './offer.validation';

const router = Router();

router.post(
  '/',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(offerValidations.createOfferValidation),
  offerController.createOffer
);
router.put(
  '/:id',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(offerValidations.updateOfferValidation),
  offerController.updateOffer
);
router.patch(
  '/status',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(offerValidations.updateOfferStatus),
  offerController.updateOfferStatus
);
router.delete('/:id', offerController.softDeleteOffer);

router.get('/', offerController.getOffers);
router.get('/public', offerController.getPublicOffers);
router.get('/ending-soon', offerController.getEndingSoonOffers);
router.get('/popular', offerController.getPopularOffers);
router.get('/:id', offerController.getOfferById);

const offerRouter = router;

export default offerRouter;
