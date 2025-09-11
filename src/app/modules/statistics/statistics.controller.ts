import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import statisticsService from './statistics.service';

class StatisticsController {
  getSuperAdminStatistics = catchAsync(async (req, res) => {
    const result = await statisticsService.getSuperAdminStatistics();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Statistics retrieved successfully',
    });
  });

  getAdminStatistics = catchAsync(async (req, res) => {
    const result = await statisticsService.getAdminStatistics();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Statistics retrieved successfully',
    });
  });

  getModeratorStatistics = catchAsync(async (req, res) => {
    const result = await statisticsService.getModeratorStatistics();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Statistics retrieved successfully',
    });
  });
}

export default new StatisticsController();
