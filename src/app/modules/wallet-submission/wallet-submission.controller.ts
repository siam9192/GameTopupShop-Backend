import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import Pick from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import walletSubmissionService from './wallet-submission.service';

class WalletSubmissionController {
  createWalletSubmission = catchAsync(async (req, res) => {
    const result = walletSubmissionService.createWalletSubmissionIntoDB(req.user, req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      data: result,
      message: 'Wallet submission created successfully',
    });
  });
   approveWalletSubmission = catchAsync(async (req, res) => {
    const result = walletSubmissionService.approveWalletSubmissionIntoDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallet submission approved successfully',
    });
  });
   declineWalletSubmission = catchAsync(async (req, res) => {
    const result = walletSubmissionService.declineWalletSubmissionIntoDB(req.params.id,req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallet submission declined successfully',
    });
  });
   getWalletSubmissions = catchAsync(async (req, res) => {
    const result = walletSubmissionService.getSubmissionsFromDB(Pick(req.query,["searchTerm","customerId","methodName","minAmount","maxAmount","status"]),paginationOptionPicker(req.query));
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallet submissions retrieved successfully',
    });
  });
    getMyWalletSubmissions = catchAsync(async (req, res) => {
    const result = walletSubmissionService.getMySubmissionsFromDB(req.user,Pick(req.query,["searchTerm","methodName","minAmount","maxAmount","status"]),paginationOptionPicker(req.query));
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallet submissions retrieved successfully',
    });
  });
getWalletSubmissionById = catchAsync(async (req, res) => {
 const result = walletSubmissionService.getSubmissionByIdFromDB(req.user,req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallet submission retrieved successfully',
    });
  });
}


export default new WalletSubmissionController()