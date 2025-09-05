import AppError from '../../Errors/AppError';
import { objectId } from '../../helpers';
import { calculatePagination } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import { IAuthUser, IPaginationOptions } from '../../types';
import WalletHistoryModel from './wallet-history.model';

class WalletHistoryService {
  async getMyWalletHistoriesFromDB(authUser: IAuthUser, paginationOptions: IPaginationOptions) {
    const wallet = await WalletHistoryModel.findOne({
      customerId: objectId(authUser.userId),
    });

    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    }

    const { page, skip, limit, sortBy, sortOrder } = calculatePagination(paginationOptions);
    const histories = await WalletHistoryModel.find({ _id: wallet._id })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalResults = await WalletHistoryModel.countDocuments({ _id: wallet._id });
    const meta = {
      page,
      limit,
      totalResults,
    };

    return {
      data: histories,
      meta,
    };
  }
  async getWalletHistoryByIdFromDB(authUser: IAuthUser, id: string) {
    const wallet = await WalletHistoryModel.findOne({
      customerId: objectId(authUser.userId),
    });

    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    }

    const existingHistory = await WalletHistoryModel.findOne({ walletId: wallet._id });
    if (!existingHistory) {
      throw new AppError(httpStatus.NOT_FOUND, 'Wallet History not found');
    }
    if (existingHistory) return existingHistory;
  }
}

export default new WalletHistoryService();
