import { x } from 'pdfkit';
import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import Pick from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import administratorService from './administrator.service';

class AdministratorController {
  createAdministrator = catchAsync(async (req, res) => {
    const result = await administratorService.createAdministratorIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Administrator created successfully',
    });
  });

  updateAdministratorLevel = catchAsync(async (req, res) => {
    const result = await administratorService.updateAdministratorLevelIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Administrator level updated successfully',
    });
  });
  updateAdministratorStatus = catchAsync(async (req, res) => {
    const result = await administratorService.updateAdministratorStatusIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Administrator level updated successfully',
    });
  });

  softDeleteAdministrator = catchAsync(async (req, res) => {
    const result = await administratorService.softDeleteAdministratorIntoDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Administrator deleted successfully',
    });
  });

  getAdministrators = catchAsync(async (req, res) => {
    const result = await administratorService.getAdministratorsFromDB(
      Pick(req.query, ['fullName', 'level', 'status', 'searchTerm']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Administrators retrieved successfully',
    });
  });

  getAdministratorById = catchAsync(async (req, res) => {
    const result = await administratorService.getAdministratorByIdFromDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Administrators retrieved successfully',
    });
  });
}

export default new AdministratorController();
