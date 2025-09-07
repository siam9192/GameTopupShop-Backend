import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import bannerService from './banner.service';

class BannerController {
  createBanner = catchAsync(async (req, res) => {
    const result = await bannerService.createBannerIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      data: result,
      message: 'Banner created successfully',
    });
  });
  updateBanner = catchAsync(async (req, res) => {
    const result = await bannerService.updateBannerIntoDB(req.params.id, req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Banner updated successfully',
    });
  });

  deleteBanner = catchAsync(async (req, res) => {
    const result = await bannerService.deleteBannerFromDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Banner deleted successfully',
    });
  });

  getBanners = catchAsync(async (req, res) => {
    const result = await bannerService.getBannersFromDB(paginationOptionPicker(req.query));
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Banners retrieved Successfully',
    });
  });
  getPublicBanners = catchAsync(async (req, res) => {
    const result = await bannerService.getPublicBannersFromDB();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Banners retrieved Successfully',
    });
  });
  getBannerById = catchAsync(async (req, res) => {
    const result = await bannerService.getBannerByIdFromDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Banner retrieved Successfully',
    });
  });
}

export default new BannerController();
