import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import walletHistoryService from './wallet-history.service';

class WalletHistoryController {
  getMyWalletHistories = catchAsync(async (req, res) => {
    const result = await walletHistoryService.getMyWalletHistoriesFromDB(
      req.user,
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallet histories retrieved successfully',
    });
  });
  getWalletHistoryById = catchAsync(async (req, res) => {
    const result = await walletHistoryService.getWalletHistoryByIdFromDB(req.user, req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallet history retrieved successfully',
    });
  });
}

export default new WalletHistoryController();
