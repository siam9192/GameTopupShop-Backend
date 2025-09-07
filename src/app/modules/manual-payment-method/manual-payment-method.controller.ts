import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import Pick from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import manualPaymentMethodService from './manual-payment-method.service';

class ManualPaymentMethodController {
  createMethod = catchAsync(async (req, res) => {
    const result = await manualPaymentMethodService.createMethodIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      data: result,
      message: 'Manual method created Successfully',
    });
  });
  updateMethod = catchAsync(async (req, res) => {
    const result = await manualPaymentMethodService.updateMethodIntoDB(req.params.id, req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Manual method updated Successfully',
    });
  });
  updateMethodStatus = catchAsync(async (req, res) => {
    const result = await manualPaymentMethodService.updateMethodStatus(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Manual method status updated Successfully',
    });
  });

  softDeleteMethod = catchAsync(async (req, res) => {
    const result = await manualPaymentMethodService.softDeleteMethodFromDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Manual method deleted Successfully',
    });
  });

  getMethods = catchAsync(async (req, res) => {
    const result = await manualPaymentMethodService.getMethodsFromDB(
      Pick(req.query, ['searchTerm', 'name', 'status']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Manual methods retrieved Successfully',
    });
  });

  getPublicPaymentMethods = catchAsync(async (req, res) => {
    const result = await manualPaymentMethodService.getPubicMethodsFromDB(
      Pick(req.query, ['searchTerm', 'name']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Manual methods retrieved Successfully',
    });
  });

  getMethodById = catchAsync(async (req, res) => {
    const result = await manualPaymentMethodService.getMethodByIdFromDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Manual method retrieved Successfully',
    });
  });
}

export default new ManualPaymentMethodController();
