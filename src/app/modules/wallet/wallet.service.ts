import { Types } from 'mongoose';
import { IPaginationOptions } from '../../types';
import { UpdateWalletBalancePayload, WalletsFilterPayload } from './wallet.interface';
import { calculatePagination } from '../../helpers/paginationHelper';
import WalletModel from './wallet.model';
import AppError from '../../Errors/AppError';
import { objectId } from '../../helpers';
import httpStatus from '../../shared/http-status';

class WalletService {
  async getWalletsFromDB(payload: WalletsFilterPayload, paginationOptions: IPaginationOptions) {
    const { id, customerId, minBalance, maxBalance } = payload;
    let whereConditions: any = {};

    if (id && Types.ObjectId.isValid(id)) {
      whereConditions._id = objectId(id);
    } else if (customerId && Types.ObjectId.isValid(customerId)) {
      whereConditions.customerId = objectId(customerId);
    }

    if (
      (minBalance !== undefined && !isNaN(Number(minBalance))) ||
      (maxBalance !== undefined && !isNaN(Number(maxBalance)))
    ) {
      whereConditions.balance = {};

      if (minBalance !== undefined && !isNaN(Number(minBalance))) {
        whereConditions.balance.$gte = Number(minBalance);
      }

      if (maxBalance !== undefined && !isNaN(Number(maxBalance))) {
        whereConditions.balance.$lte = Number(maxBalance);
      }
    }

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const wallets = await WalletModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('customerId')
      .lean();

    const totalResults = await WalletModel.countDocuments(whereConditions);

    const total = await WalletModel.countDocuments();
    const data: any[] = wallets.map(({ customerId, ...rest }) => ({
      ...rest,
      customerId: customerId._id,
      customer: customerId,
    }));
    return {
      data,
      meta: {
        page,
        limit,
        totalResults,
        total,
      },
    };
  }

  async getWalletByCustomerIdFromDB(customerId: string) {
    // validate id
    if (!Types.ObjectId.isValid(customerId))
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');

    // Fetch data
    const wallet = await WalletModel.findOne({
      customerId: objectId(customerId),
    });

    // Check existence
    if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'wallet not found');

    return wallet;
  }

  async getWalletByIdFromDB(id: string) {
    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');

    // Fetch data
    const wallet = await WalletModel.findOne({
      _id: objectId(id),
    })
      .populate('customerId')
      .lean();

    // Check existence
    if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'wallet not found');

    const { customerId, ...rest } = wallet;
    return {
      ...rest,
      customerId: customerId._id,
      customer: customerId,
    };
  }

  async updateWalletBalanceIntoDB(payload: UpdateWalletBalancePayload) {
    const { id, balance } = payload;
    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');

    // Fetch data
    const wallet = await WalletModel.findOne({
      _id: objectId(id),
    });

    if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');

    return await WalletModel.findByIdAndUpdate(
      id,
      {
        balance,
      },
      { new: true }
    );
  }
}

export default new WalletService();
