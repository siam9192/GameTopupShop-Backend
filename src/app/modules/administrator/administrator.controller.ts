import { x } from 'pdfkit';
import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import Pick from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import administratorService from './administrator.service';

class AdministratorController {
  createAdministrator = catchAsync(async (req, res) => {
    const result = administratorService.createAdministratorIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Administrator created Successfully',
    });
  });

  updateAdministratorLevel = catchAsync(async (req, res) => {
    const result = administratorService.updateAdministratorLevelIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Administrator level updated Successfully',
    });
  });
  updateAdministratorStatus = catchAsync(async (req, res) => {
    const result = administratorService.updateAdministratorStatusIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Administrator level updated Successfully',
    });
  });

  getAdministrators = catchAsync(async (req, res) => {
    const result = administratorService.getAdministratorsFromDB(
      Pick(req.query, ['fullName', 'level', 'status', 'searchTerm']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Administrators retrieved successfully',
    });
  });

  getAdministratorById = catchAsync(async (req, res) => {
    const result = administratorService.getAdministratorByIdFromDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Administrators retrieved successfully',
    });
  });
}

export default new AdministratorController();
