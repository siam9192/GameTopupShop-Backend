import AppError from '../../Errors/AppError';
import { objectId } from '../../helpers';
import httpStatus from '../../shared/http-status';
import { IAuthUser } from '../../types';
import CustomerModel from '../customer/customer.model';
import OfferModel from '../offer/offer.model';
import { OrderStatus } from '../order/order.interface';
import OrderModel from '../order/order.model';
import { TopupStatus } from '../topup/topup.interface';
import TopupModel from '../topup/topup.model';
import { AccountStatus } from '../user/user.interface';
import { WalletSubmissionStatus } from '../wallet-submission/wallet-submission.interface';
import WalletSubmissionModel from '../wallet-submission/wallet-submission.model';
import WalletModel from '../wallet/wallet.model';

class MetadataService {
  async getSuperAdminMetadata() {
    const topups = await TopupModel.countDocuments({
      status: { $ne: TopupStatus.DELETED },
    });
    const offers = await OfferModel.countDocuments({
      status: { $ne: TopupStatus.DELETED },
    });

    const orders = await OrderModel.countDocuments({
      status: { $ne: OrderStatus.PENDING },
    });

    const revenue = await OrderModel.aggregate([
      {
        $match: {
          status: OrderStatus.COMPLETED,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$payment.amount' },
        },
      },
    ]);

    const customers = await CustomerModel.countDocuments({
      status: { $ne: AccountStatus.DELETED },
    });
    const administrators = await CustomerModel.countDocuments({
      status: { $ne: AccountStatus.DELETED },
    });

    const users = customers + administrators;
    const products = topups + offers;

    return {
      users,
      revenue,
      products,
      orders,
    };
  }
  async getAdminMetadata() {
    const topups = await TopupModel.countDocuments({
      status: { $ne: TopupStatus.DELETED },
    });
    const offers = await OfferModel.countDocuments({
      status: { $ne: TopupStatus.DELETED },
    });

    const orders = await OrderModel.countDocuments({
      status: { $ne: OrderStatus.PENDING },
    });

    const revenue = await OrderModel.aggregate([
      {
        $match: {
          status: { $ne: OrderStatus.COMPLETED },
        },
      },
    ]);

    const customers = await CustomerModel.countDocuments({
      status: { $ne: AccountStatus.DELETED },
    });

    const products = topups + offers;

    return {
      customers,
      revenue,
      products,
      orders,
    };
  }
  async getModeratorMetadata() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const topups = await TopupModel.countDocuments({
      status: { $ne: TopupStatus.DELETED },
    });
    const offers = await OfferModel.countDocuments({
      status: { $ne: TopupStatus.DELETED },
    });

    const orders = await OrderModel.countDocuments({
      status: { $ne: OrderStatus.PENDING },
    });

    const customers = await CustomerModel.countDocuments({
      status: { $ne: AccountStatus.DELETED },
    });
    const administrators = await CustomerModel.countDocuments({
      status: { $ne: AccountStatus.DELETED },
    });

    const users = customers + administrators;

    const runningOrders = await OrderModel.countDocuments({
      status: { $ne: OrderStatus.RUNNING },
    });

    const newCustomers = await CustomerModel.countDocuments({
      status: { $ne: AccountStatus.DELETED },
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const products = topups + offers;

    return {
      users,
      products,
      orders,
      runningOrders,
      newCustomers,
    };
  }

  async getCustomerMetadata(authUser: IAuthUser) {
    const wallet = await WalletModel.findOne({ customerId: objectId(authUser.userId) });
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    }

    const orderInProcess = await OrderModel.countDocuments({
      customerId: objectId(authUser.userId),
      status: OrderStatus.RUNNING,
    });

    const ordersCompleted = await OrderModel.countDocuments({
      customerId: objectId(authUser.userId),
      status: OrderStatus.COMPLETED,
    });

    const ordersAmount = await OrderModel.aggregate([
      {
        $match: {
          customerId: objectId(authUser.userId),
          status: { $in: [OrderStatus.RUNNING, OrderStatus.COMPLETED] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$payment.amount' },
        },
      },
    ]);

    const pendingWalletAmount = await WalletSubmissionModel.aggregate([
      {
        $match: {
          customerId: objectId(authUser.userId),
          status: WalletSubmissionStatus.PENDING,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    return {
      walletBalance: wallet.balance,
      pendingWalletAmount,
      orderInProcess,
      ordersCompleted,
      ordersAmount,
    };
  }

  async getUsersMetadata() {
    const customers = await CustomerModel.countDocuments({
      status: { $ne: AccountStatus.DELETED },
    });
    const administrators = await CustomerModel.countDocuments({
      status: { $ne: AccountStatus.DELETED },
    });

    const blockedCustomers = await CustomerModel.countDocuments({
      status: AccountStatus.BLOCKED,
    });
    const blockedAdministrators = await CustomerModel.countDocuments({
      status: AccountStatus.BLOCKED,
    });
    const users = customers + administrators;
    const blockedUsers = blockedAdministrators + blockedCustomers;

    return {
      users,
      customers,
      administrators,
      blockedUsers,
    };
  }
}

export default new MetadataService();
4;
