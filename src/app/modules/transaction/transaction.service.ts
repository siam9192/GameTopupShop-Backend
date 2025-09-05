import { startSession, Types } from 'mongoose';
import { IAuthUser, IPaginationOptions } from '../../types';
import {
  LivePaymentMethod,
  MakeOrderLivePaymentPayload,
  MakeWalletPaymentPayload,
  PaymentMethod,
  TransactionsFilterPayload,
  TransactionStatus,
  TransactionType,
  UpdateTransactionStatusPayload,
} from './transaction.interface';
import AppError from '../../Errors/AppError';
import httpStatus from '../../shared/http-status';
import { objectId } from '../../helpers';
import TransactionModel from './transaction.model';
import { calculatePagination } from '../../helpers/paginationHelper';
import { UserRole } from '../user/user.interface';
import OrderModel from '../order/order.model';
import { OrderStatus, PaymentStatus } from '../order/order.interface';
import WalletModel from '../wallet/wallet.model';
import { GLOBAL_ERROR_MESSAGE } from '../../utils/constant';
import NotificationModel from '../notification/notification.model';
import { NotificationCategory, NotificationType } from '../notification/notification.interface';
import { generateTransactionId } from '../../utils/helpers';
import { sslcommerzPayment } from '../../payment-method/sslCommez';
import envConfig from '../../config/env.config';
import { stripePayment } from '../../payment-method/stripePayment';
import CustomerModel from '../customer/customer.model';
import { WalletHistoryType } from '../wallet-history/wallet-history.interface';
import WalletHistoryModel from '../wallet-history/wallet-history.model';

class TransactionService {
  async getTransactionsFromDB(
    filterPayload: TransactionsFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
    const { id, customerId, orderId, minAmount, maxAmount, ...restPayload } = filterPayload;
    const whereConditions: Record<string, any> = {
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

    if (
      (minAmount !== undefined && !isNaN(Number(minAmount))) ||
      (maxAmount !== undefined && !isNaN(Number(maxAmount)))
    ) {
      whereConditions.amount = {};

      if (minAmount !== undefined && !isNaN(Number(minAmount))) {
        whereConditions.amount.$gte = Number(minAmount);
      }

      if (maxAmount !== undefined && !isNaN(Number(maxAmount))) {
        whereConditions.amount.$lte = Number(maxAmount);
      }
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
  async makeOrderWalletPayment(authUser: IAuthUser, payload: MakeWalletPaymentPayload) {
    const { orderId } = payload;
    const order = await OrderModel.findOne({
      _id: objectId(orderId),
      customerId: objectId(authUser.userId),
      status: OrderStatus.PENDING,
    });
    if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');

    const wallet = await WalletModel.findOne({ customerId: objectId(authUser.userId) });
    if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');

    if (wallet.balance < order.payment.amount) {
      throw new AppError(httpStatus.FORBIDDEN, 'Insufficient balance');
    }
    const session = await startSession();
    session.startTransaction();
    try {
      const createdTransaction = (
        await TransactionModel.create(
          [
            {
              customerId: authUser.userId,
              orderId: orderId,
              amount: order.payment.amount,
              currency: 'BDT',
              type: TransactionType.CREDIT,
              method: PaymentMethod.WALLET,
              status: TransactionStatus.SUCCESS,
            },
          ],
          { session }
        )
      )[0];

      const updateOrderStatus = await OrderModel.updateOne(
        {
          _id: order._id,
        },
        {
          'payment.status': PaymentStatus.PAID,
          'payment.transactionId': createdTransaction.id,
          status: OrderStatus.RUNNING,
        },
        { session }
      );

      if (!updateOrderStatus.modifiedCount) {
        throw new Error('Update order failed');
      }

      const createdWalletHistory = await WalletHistoryModel.create(
        [
          {
            walletId: wallet._id,
            prevBalance: wallet.balance,
            amount: order.payment.amount,
            type: WalletHistoryType.DEBIT,
          },
        ],
        { session }
      );

      if (!createdWalletHistory) {
        throw new Error('Create wallet history failed ');
      }

      NotificationModel.create({
        customerId: authUser.userId,
        title: 'Your order is placed successfully',
        message: 'We’ve received your order and will start processing it shortly.',
        type: NotificationType.INFO,
        category: NotificationCategory.ORDER,
        visitId: orderId,
      });
      await session.commitTransaction();
      return createdTransaction;
    } catch (error) {
      await session.abortTransaction();
      throw new AppError(httpStatus.BAD_REQUEST, GLOBAL_ERROR_MESSAGE);
    } finally {
      await session.endSession();
    }
  }
  async makeOrderLivePayment(authUser: IAuthUser, payload: MakeOrderLivePaymentPayload) {
    const { orderId, method } = payload;
    const order = await OrderModel.findOne({
      _id: objectId(orderId),
      customerId: objectId(authUser.userId),
      status: OrderStatus.PENDING,
    });
    if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    const referenceId = generateTransactionId();
    let paymentUrl;

    const paymentPayload = {
      transactionId: referenceId,
      amount: order.payment.amount,
      currency: 'BDT',
      successUrl: envConfig.orderPayment.success_url as string,
      cancelUrl: envConfig.orderPayment.cancel_url as string,
      service_name: order.product.name + ' X ' + order.product.quantity,
    };

    if (method === LivePaymentMethod.SSLCOMMERZ) {
      paymentUrl = await sslcommerzPayment(paymentPayload);
    } else {
      paymentUrl = await stripePayment(paymentPayload);
    }

    await TransactionModel.create({
      customerId: authUser.userId,
      orderId: orderId,
      amount: order.payment.amount,
      currency: 'BDT',
      type: TransactionType.CREDIT,
      method: PaymentMethod.GATEWAY,
      status: TransactionStatus.PENDING,
      reference: referenceId,
    });

    return {
      paymentUrl,
    };
  }
  async confirmOrderPayment(transactionId: string) {
    const transaction = await TransactionModel.findOne({
      _id: objectId(transactionId),
      status: TransactionStatus.PENDING,
    });

    if (!transaction) throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');

    const order = await OrderModel.findOne({
      _id: transaction.orderId,
      status: OrderStatus.PENDING,
    });

    if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    await OrderModel.updateOne(
      {
        _id: transaction.orderId,
      },
      {
        status: OrderStatus.RUNNING,
        'payment.status': PaymentStatus.PAID,
      }
    );

    await TransactionModel.updateOne(
      {
        _id: transaction._id,
      },
      { status: TransactionStatus.SUCCESS }
    );
    CustomerModel.updateOne({
      _id: order.customerId,
      $inc: {
        ordersCount: 1,
      },
    });
  }
  async cancelOrderPayment(transactionIdId: string) {
    const transaction = await TransactionModel.findOne({
      _id: objectId(transactionIdId),
      status: TransactionStatus.PENDING,
    });

    if (!transaction) throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');

    await TransactionModel.updateOne(
      {
        _id: transaction._id,
      },
      { status: TransactionStatus.FAILED }
    );
  }
}

export default new TransactionService();
