import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import appSettingService from './app-setting.service';

class AppSettingController {
  updateAppSetting = catchAsync(async (req, res) => {
    const result = appSettingService.updateAppSetting(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'App setting updated successfully',
    });
  });
  getAppSetting = catchAsync(async (req, res) => {
    const result = appSettingService.getAppSettingFromDB();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'App setting retrieved successfully',
    });
  });
}

export default new AppSettingController();
