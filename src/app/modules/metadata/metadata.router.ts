import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import metadataController from './metadata.controller';
import { ALL_ADMINISTRATOR_LEVELS } from '../../utils/constant';

const router = Router();

router.get(
  '/role/super-admin',
  auth(UserRole.SUPER_ADMIN),
  metadataController.getSuperAdminMetadata
);

router.get('/role/admin', auth(UserRole.ADMIN), metadataController.getAdminMetadata);

router.get('/role/moderator', auth(UserRole.MODERATOR), metadataController.getModeratorMetadata);

router.get('/role/customer', auth(UserRole.CUSTOMER), metadataController.getCustomerMetadata);

router.get('/users', auth(...ALL_ADMINISTRATOR_LEVELS), metadataController.getUsersMetadata);

router.get('/products', auth(...ALL_ADMINISTRATOR_LEVELS), metadataController.getProductsMetadata);

const metadataRouter = router;

export default metadataRouter;
