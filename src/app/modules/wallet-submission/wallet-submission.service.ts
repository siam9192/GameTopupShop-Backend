import { startSession, Types } from 'mongoose';
import AppError from '../../Errors/AppError';
import httpStatus from '../../shared/http-status';
import { IAuthUser, IPaginationOptions } from '../../types';
import ManualPaymentMethodModel from '../manual-payment-method/manual-payment-method.model';
import {
  CreateWalletSubmissionPayload,
  DeclineWalletSubmissionPayload,
  WalletSubmissionsFilterPayload,
  WalletSubmissionStatus,
} from './wallet-submission.interface';
import WalletSubmissionModel from './wallet-submission.model';
import WalletModel from '../wallet/wallet.model';
import { calculatePagination } from '../../helpers/paginationHelper';
import { objectId } from '../../helpers';
import { UserRole } from '../user/user.interface';
import NotificationModel from '../notification/notification.model';
import { NotificationCategory, NotificationType } from '../notification/notification.interface';

class WalletSubmissionService {
  async createWalletSubmissionIntoDB(authUser: IAuthUser, payload: CreateWalletSubmissionPayload) {
    const existingMethod = await ManualPaymentMethodModel.findById(payload.methodId);

    if (!existingMethod) throw new AppError(httpStatus.NOT_FOUND, 'Method not found');

    const result = await WalletSubmissionModel.create({
      ...payload,
      methodName: existingMethod.name,
    });

    NotificationModel.create({
      customerId: authUser.userId,
      title: 'Thanks for wallet submission',
      message: 'Your wallet submission has been received and is under review.',
      type: NotificationType.SUCCESS,
      category: NotificationCategory.WALLET_SUBMISSION,
    });

    NotificationModel.create({
      customerId: authUser.userId,
      title: 'New Wallet Submission',
      message: `A new wallet submission of ${payload.amount} has been received and is awaiting your review.`,
      type: NotificationType.SUCCESS,
      category: NotificationCategory.WALLET_SUBMISSION,
    });

    return result;
  }

  async approveWalletSubmissionIntoDB(id: string) {
    const existingSubmission = await WalletSubmissionModel.findById(id);
    if (!existingSubmission) throw new AppError(httpStatus.NOT_FOUND, 'Submission not found');
    const existingWallet = await WalletModel.findOne({ customerId: existingSubmission.customerId });
    if (!existingWallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');

    const session = await startSession();
    session.startTransaction();
    try {
      const updateSubmissionStatus = await WalletSubmissionModel.updateOne(
        { _id: existingSubmission._id },
        { status: WalletSubmissionStatus.APPROVED },
        { session }
      );

      if (!updateSubmissionStatus.modifiedCount) {
        throw new Error('Update submission status  failed ');
      }
      const updateWalletBalance = await WalletModel.updateOne(
        { _id: existingWallet._id },
        {
          $inc: {
            balance: existingSubmission.amount,
          },
        },
        { session }
      );

      if (!updateWalletBalance.modifiedCount) {
        throw new Error('Update wallet balance failed ');
      }
      await session.commitTransaction();

      NotificationModel.create({
        customerId: existingSubmission.customerId,
        title: 'Wallet Submission Approved',
        message: `Your submission of ${existingSubmission.amount} has been approved and credited to your wallet balance.`,
        visitId: id,
        type: NotificationType.SUCCESS,
        category: NotificationCategory.WALLET_SUBMISSION,
      });

      return await WalletSubmissionModel.findById(existingSubmission._id);
    } catch (error: any) {
      await session.abortTransaction();
      throw new AppError(httpStatus.BAD_REQUEST, error.message);
    } finally {
      await session.endSession();
    }
  }

  async declineWalletSubmissionIntoDB(id: string, payload: DeclineWalletSubmissionPayload) {
    const existingSubmission = await WalletSubmissionModel.findById(id);
    if (!existingSubmission) throw new AppError(httpStatus.NOT_FOUND, 'Submission not found');

    const result = await WalletSubmissionModel.findByIdAndUpdate(
      existingSubmission._id,
      { status: WalletSubmissionStatus.DECLINED },
      { new: true }
    );

    NotificationModel.create({
      customerId: existingSubmission.customerId,
      title: 'Wallet Submission Declined',
      message: `Your submission of ${existingSubmission.amount} has been declined. Please check your submission details.`,

      visitId: id,
      type: NotificationType.SUCCESS,
      category: NotificationCategory.WALLET_SUBMISSION,
    });
    return result;
  }

  async getMySubmissionsFromDB(
    authUser: IAuthUser,
    payload: WalletSubmissionsFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
    const { searchTerm, minAmount, maxAmount } = payload;
    let whereConditions: any = {
      customerId: objectId(authUser.userId),
    };
    if (searchTerm) {
      if (Types.ObjectId.isValid(searchTerm)) {
        whereConditions.customerId = searchTerm;
      }
    }

    if (
      (minAmount !== undefined && !isNaN(Number(minAmount))) ||
      (maxAmount !== undefined && !isNaN(Number(maxAmount)))
    ) {
      whereConditions.balance = {};

      if (minAmount !== undefined && !isNaN(Number(minAmount))) {
        whereConditions.balance.$gte = Number(minAmount);
      }

      if (maxAmount !== undefined && !isNaN(Number(maxAmount))) {
        whereConditions.balance.$lte = Number(maxAmount);
      }
    }

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions, {
      limitOverride: 20,
    });

    const wallets = await WalletSubmissionModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate(['customerId', 'methodId'])
      .lean();

    const totalResults = await WalletModel.countDocuments(whereConditions);

    const total = await WalletModel.countDocuments();
    const data: any[] = wallets.map(({ customerId, methodId, ...rest }) => ({
      ...rest,
      customer: customerId,
      method: methodId,
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
  async getSubmissionsFromDB(
    payload: WalletSubmissionsFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
    const { searchTerm, minAmount, maxAmount } = payload;
    let whereConditions: any = {};
    if (searchTerm) {
      if (Types.ObjectId.isValid(searchTerm)) {
        whereConditions.customerId = searchTerm;
      }
    }

    if (
      (minAmount !== undefined && !isNaN(Number(minAmount))) ||
      (maxAmount !== undefined && !isNaN(Number(maxAmount)))
    ) {
      whereConditions.balance = {};

      if (minAmount !== undefined && !isNaN(Number(minAmount))) {
        whereConditions.balance.$gte = Number(minAmount);
      }

      if (maxAmount !== undefined && !isNaN(Number(maxAmount))) {
        whereConditions.balance.$lte = Number(maxAmount);
      }
    }

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions, {
      limitOverride: 20,
    });

    const wallets = await WalletSubmissionModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate(['customerId', 'methodId'])
      .lean();

    const totalResults = await WalletModel.countDocuments(whereConditions);

    const total = await WalletModel.countDocuments();
    const data: any[] = wallets.map(({ customerId, methodId, ...rest }) => ({
      ...rest,
      customer: customerId,
      method: methodId,
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
  async getSubmissionByIdFromDB(authUser: IAuthUser, id: string) {
    const existingSubmission = await WalletSubmissionModel.findById(id);
    if (!existingSubmission) throw new AppError(httpStatus.NOT_FOUND, 'Submission not found');
    if (
      authUser.role === UserRole.CUSTOMER &&
      existingSubmission.customerId.toString() !== authUser.userId
    ) {
      throw new AppError(httpStatus.NOT_FOUND, 'Submission not found');
    }
    return existingSubmission;
  }
}

export default new WalletSubmissionService();
