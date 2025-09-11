import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import Pick from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import offerService from './offer.service';

class OfferController {
  createOffer = catchAsync(async (req, res) => {
    const result = await offerService.createOfferIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      data: result,
      message: 'Offer created successfully',
    });
  });

  updateOffer = catchAsync(async (req, res) => {
    const result = await offerService.updateOfferIntoDB(req.params.id, req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Offer updated successfully',
    });
  });

  updateOfferStatus = catchAsync(async (req, res) => {
    const result = await offerService.updateOfferStatusIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Offer status updated successfully',
    });
  });

  softDeleteOffer = catchAsync(async (req, res) => {
    const result = await offerService.softDeleteOfferFromDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Offer deleted successfully',
    });
  });
  getOffers = catchAsync(async (req, res) => {
    const result = await offerService.getOffersFromDB(
      Pick(req.query, ['name', 'platformName', 'status', 'searchTerm']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Offers retrieved successfully',
    });
  });
  getPublicOffers = catchAsync(async (req, res) => {
    const result = await offerService.getOffersFromDB(
      Pick(req.query, ['name', 'platformName', 'status', 'searchTerm']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Offers retrieved successfully',
    });
  });

  getOfferById = catchAsync(async (req, res) => {
    const result = await offerService.getOfferByIdFromDB(req.user, req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Offer retrieved successfully',
    });
  });

  getEndingSoonOffers = catchAsync(async (req, res) => {
    const result = await offerService.getEndingSoonOffersFromDB(paginationOptionPicker(req.query));
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Offers retrieved successfully',
    });
  });
  getPopularOffers = catchAsync(async (req, res) => {
    const result = await offerService.getPopularOffersFromDB(paginationOptionPicker(req.query));
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Offers retrieved successfully',
    });
  });
}

export default new OfferController();
