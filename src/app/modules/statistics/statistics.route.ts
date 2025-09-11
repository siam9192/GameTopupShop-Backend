import { Router } from 'express';
import statisticsController from './statistics.controller';

const router = Router();

router.get('/superadmin', statisticsController.getSuperAdminStatistics);

router.get('/admin', statisticsController.getAdminStatistics);

router.get('/moderator', statisticsController.getModeratorStatistics);

const statisticsRouter = router;
export default statisticsRouter;
