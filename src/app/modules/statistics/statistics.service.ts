import CustomerModel from '../customer/customer.model';
import { OrderStatus } from '../order/order.interface';
import OrderModel from '../order/order.model';
import { subMonths, startOfMonth } from 'date-fns';
import { AccountStatus } from '../user/user.interface';
class StatisticsService {
  async getSuperAdminStatistics() {
    const lastMonthRevenues = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: subMonths(new Date(), 12), // orders from last 12 months
          },
          status: OrderStatus.COMPLETED, // optional: only include completed/paid orders
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalRevenue: { $sum: '$payment.amount' }, // adjust field name if different
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          totalRevenue: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    const lastMonthCustomers = await CustomerModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: subMonths(new Date(), 12), // orders from last 12 months
          },
          status: { $ne: AccountStatus.DELETED }, // optional: only include completed/paid orders
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          totalRevenue: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    return {
      lastMonthRevenues,
      lastMonthCustomers,
    };
  }
  async getAdminStatistics() {
    const lastMonthRevenues = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: subMonths(new Date(), 12), // orders from last 12 months
          },
          status: OrderStatus.COMPLETED, // optional: only include completed/paid orders
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalRevenue: { $sum: '$payment.amount' }, // adjust field name if different
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          totalRevenue: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    const lastMonthCustomers = await CustomerModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: subMonths(new Date(), 12), // orders from last 12 months
          },
          status: { $ne: AccountStatus.DELETED }, // optional: only include completed/paid orders
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          totalRevenue: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    return {
      lastMonthRevenues,
      lastMonthCustomers,
    };
  }
  async getModeratorStatistics() {
    const lastMonthsRevenues = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: subMonths(new Date(), 12), // orders from last 12 months
          },
          status: OrderStatus.COMPLETED, // optional: only include completed/paid orders
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalRevenue: { $sum: '$payment.amount' }, // adjust field name if different
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          totalRevenue: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    const lastMonthsCustomers = await CustomerModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: subMonths(new Date(), 12), // orders from last 12 months
          },
          status: { $ne: AccountStatus.DELETED }, // optional: only include completed/paid orders
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          totalRevenue: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    const lastMonthsOrders = await CustomerModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: subMonths(new Date(), 12), // orders from last 12 months
          },
          status: { $ne: OrderStatus.PENDING }, // optional: only include completed/paid orders
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          totalRevenue: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    return {
      lastMonthsRevenues,
      lastMonthsCustomers,
      lastMonthsOrders,
    };
  }

  async getProductStatistics() {}
}

export default new StatisticsService();
