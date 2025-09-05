import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ALL_ADMINISTRATOR_LEVELS } from '../../utils/constant';
import validateRequest from '../../middlewares/validateRequest';
import currencyValidations from './currency.validation';
import currencyController from './currency.controller';

const router = Router();

router.post(
  '/',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(currencyValidations.createCurrencyValidation),
  currencyController.createCurrency
);
router.put(
  '/:id',
  auth(...ALL_ADMINISTRATOR_LEVELS),
  validateRequest(currencyValidations.updateCurrencyValidation),
  currencyController.updateCurrency
);
router.delete('/:id', auth(...ALL_ADMINISTRATOR_LEVELS), currencyController.deleteCurrency);

router.get('/', auth(...ALL_ADMINISTRATOR_LEVELS), currencyController.getCurrencies);
router.get('/:id', auth(...ALL_ADMINISTRATOR_LEVELS), currencyController.getCurrencyById);

const currencyRouter = router;
export default currencyRouter;
