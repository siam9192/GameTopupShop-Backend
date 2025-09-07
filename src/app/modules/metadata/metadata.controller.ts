import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import metadataService from './metadata.service';

class MetadataController {
  getSuperAdminMetadata = catchAsync(async (req, res) => {
    const result = await metadataService.getSuperAdminMetadata();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Order created successfully',
    });
  });
}

export default new MetadataController();
