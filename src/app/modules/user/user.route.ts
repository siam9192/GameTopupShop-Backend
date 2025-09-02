import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ALL_ROLES } from '../../utils/constant';
import userController from './user.controller';

const router = Router();
router.put('/', auth(ALL_ROLES), userController.updateUserProfile);

router.get('/current', auth(ALL_ROLES), userController.getCurrentUser);

const userRouter = router;

export default userRouter;
