import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import userService from './user.service';

class UserController {
  updateUserProfile = catchAsync(async (req, res) => {
    const result = userService.updateUserProfileIntoDB(req.user, req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'User profile updated Successfully',
    });
  });

  getCurrentUser = catchAsync(async (req, res) => {
    const result = userService.getCurrentUserFromDB(req.user);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'User profile retrieved Successfully',
    });
  });
}

export default new UserController();
