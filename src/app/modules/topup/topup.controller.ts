import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import Pick from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import topupService from './topup.service';

class TopupController {
  createTopup = catchAsync(async (req, res) => {
    const result = await topupService.createTopupIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      data: result,
      message: 'Topup created successfully',
    });
  });

  updateTopup = catchAsync(async (req, res) => {
    const result = await topupService.updateTopupIntoDB(req.params.id, req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Topup updated successfully',
    });
  });

  updateTopupStatus = catchAsync(async (req, res) => {
    const result = await topupService.updateTopupStatusIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Topup status updated successfully',
    });
  });

  softDeleteTopup = catchAsync(async (req, res) => {
    const result = await topupService.topupSoftDeleteFormDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Topup deleted successfully',
    });
  });
  getTopups = catchAsync(async (req, res) => {
    const result = await topupService.getTopupsFromDB(
      Pick(req.query, ['name', 'platformName', 'status', 'searchTerm']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Topups retrieved successfully',
    });
  });
  getPublicTopups = catchAsync(async (req, res) => {
    const result = await topupService.getTopupsFromDB(
      Pick(req.query, ['name', 'platformName', 'status', 'searchTerm']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Topups retrieved successfully',
    });
  });

  getTopupById = catchAsync(async (req, res) => {
    const result = await topupService.getTopupByIdFromDB(req.user, req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Topup retrieved successfully',
    });
  });

  getFeaturedTopups = catchAsync(async (req, res) => {
    const result = await topupService.getFeaturedTopupsFromDB(paginationOptionPicker(req.query));
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Topups retrieved successfully',
    });
  });

  getPopularTopups = catchAsync(async (req, res) => {
    const result = await topupService.getPopularTopupsFromDB(paginationOptionPicker(req.query));
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Topups retrieved successfully',
    });
  });
}

export default new TopupController();
