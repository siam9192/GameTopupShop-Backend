import { Request, Response } from 'express';
import authService from './auth.service';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';

class AuthController {
  customerSignUp = catchAsync(async (req, res) => {
    const result = await authService.customerSignup(req.body);

    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Account created Successfully',
    });
  });
  customerSignin = catchAsync(async (req, res) => {
    const result = await authService.customerSignin(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Signin successful',
    });
  });
  administratorSignin = catchAsync(async (req, res) => {
    const result = await authService.administratorSignIn(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Signin successful',
    });
  });

  changePassword = catchAsync(async (req, res) => {
    const result = await authService.changePassword(req.user, req.body);
    sendSuccessResponse(res, {
      message: 'Password has been changed successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  });

  getNewAccessToken = catchAsync(async (req, res) => {
    const result = await authService.getNewAccessToken(req.body.refreshToken);
    sendSuccessResponse(res, {
      message: 'New access token retrieved successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  });
}

export default new AuthController();
