import { paginationOptionPicker } from "../../helpers/paginationHelper";
import httpStatus from "../../shared/http-status";
import catchAsync from "../../utils/catchAsync";
import Pick from "../../utils/pick";
import { sendSuccessResponse } from "../../utils/response";
import walletService from "./wallet.service";

class WalletController {
     getWallets = catchAsync(async (req, res) => {
    const result = walletService.getWalletsFromDB(
      Pick(req.query, ['searchTerm',"minBalance","maxBalance"]),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallets retrieved Successfully',
    });
  });
    getWalletByCustomerId = catchAsync(async (req, res) => {
    const result = walletService.getWalletByCustomerIdFromDB(
      req.params.customerId
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallet retrieved Successfully',
    });
  });
    getWalletById = catchAsync(async (req, res) => {
    const result = walletService.getWalletByIdFromDB(
      req.params.id
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallet retrieved Successfully',
    });
  });
    updateWalletBalance = catchAsync(async (req, res) => {
    const result = walletService.updateWalletBalanceIntoDB(
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Wallet balance updatedSuccessfully',
    });
  });
}


export default new WalletController()