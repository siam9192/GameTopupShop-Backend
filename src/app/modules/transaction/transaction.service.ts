import { Types } from 'mongoose';
import { IAuthUser, IPaginationOptions } from '../../types';
import { TransactionsFilterPayload, UpdateTransactionStatusPayload } from './transaction.interface';
import AppError from '../../Errors/AppError';
import httpStatus from '../../shared/http-status';
import { objectId } from '../../helpers';
import TransactionModel from './transaction.model';
import { calculatePagination } from '../../helpers/paginationHelper';
import { UserRole } from '../user/user.interface';

class TransactionService {
  async getTransactionsFromDB(
    filterPayload: TransactionsFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
    const { id, customerId, orderId, ...restPayload } = filterPayload;
    const whereConditions: Record<string, unknown> = {
      ...restPayload,
    };
    if (id) {
      if (!Types.ObjectId.isValid(id)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');
      }
      whereConditions._id = objectId(id);
    } else if (customerId) {
      whereConditions.customerId = objectId(customerId);
    } else if (orderId) {
      whereConditions.orderId = objectId(orderId);
    }

    const { page, skip, limit, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const transactions = await TransactionModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate(['customerId', 'orderId'])
      .lean();
    const totalResults = await TransactionModel.countDocuments(whereConditions);

    const total = await TransactionModel.countDocuments();
    const data = transactions.map((transaction) => {
      const { customerId, orderId, ...rest } = transaction;
      return {
        ...rest,
        customerId: customerId._id,
        orderId: orderId,
        order: orderId,
        customer: customerId,
      };
    });
    const meta = {
      page,
      limit,
      totalResults,
      total,
    };

    return {
      data,
      meta,
    };
  }
  async getMyTransactionsFromDB(
    authUser: IAuthUser,
    filterPayload: TransactionsFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
    const { id, orderId, ...restFilterPayload } = filterPayload;

    const whereConditions: Record<string, unknown> = {
      customerId: authUser.userId,
      ...restFilterPayload,
    };

    if (id) {
      if (!Types.ObjectId.isValid(id)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');
      }
      whereConditions._id = objectId(id);
    } else if (orderId) {
      whereConditions.orderId = objectId(orderId);
    }

    const { page, skip, limit, sortBy, sortOrder } = calculatePagination(paginationOptions);
    const transactions = await TransactionModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate(['orderId'])
      .lean();
    const totalResults = await TransactionModel.countDocuments(whereConditions);

    const total = await TransactionModel.countDocuments();

    const meta = {
      page,
      limit,
      totalResults,
      total,
    };

    return {
      data: transactions,
      meta,
    };
  }
  async getTransactionByIdFromDB(authUser: IAuthUser, id: string) {
    const existingTransaction = await TransactionModel.findById(id)
      .populate(['customerId', 'orderId'])
      .lean();

    if (!existingTransaction) {
      throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');
    }

    // Access control
    if (
      authUser.role === UserRole.CUSTOMER &&
      authUser.userId !== existingTransaction.customerId.toString()
    ) {
      throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');
    }

    // Format response
    const { customerId, orderId, ...rest } = existingTransaction;
    return {
      ...rest,
      customerId: customerId._id,
      order: orderId,
      customer: customerId,
    };
  }

  async updateTransactionStatusIntoDB(payload: UpdateTransactionStatusPayload) {
    const existingTransaction = await TransactionModel.findById(payload.id)
      .populate(['customerId', 'orderId'])
      .lean();

    if (!existingTransaction) {
      throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');
    }
    return await TransactionModel.findByIdAndUpdate(payload.id, { status: payload.status });
  }
}

export default new TransactionService();
