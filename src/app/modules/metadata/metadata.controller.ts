import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import metadataService from './metadata.service';

class MetadataController {
  getMetadata = catchAsync(async (req, res) => {
    const result = await metadataService.getSuperAdminMetadata();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Metadata successfully',
    });
  });
  getSuperAdminMetadata = catchAsync(async (req, res) => {
    const result = await metadataService.getSuperAdminMetadata();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Metadata successfully',
    });
  });
  getAdminMetadata = catchAsync(async (req, res) => {
    const result = await metadataService.getAdminMetadata();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Metadata successfully',
    });
  });
  getModeratorMetadata = catchAsync(async (req, res) => {
    const result = await metadataService.getModeratorMetadata();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Metadata successfully',
    });
  });
  getCustomerMetadata = catchAsync(async (req, res) => {
    const result = await metadataService.getCustomerMetadata(req.user);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Metadata successfully',
    });
  });
  getUsersMetadata = catchAsync(async (req, res) => {
    const result = await metadataService.getUsersMetadata();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Metadata successfully',
    });
  });

  getProductsMetadata = catchAsync(async (req, res) => {
    const result = await metadataService.getProductsMetadata();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Products metadata retrieved successfully',
    });
  });
}

export default new MetadataController();
