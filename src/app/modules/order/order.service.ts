import { Types } from 'mongoose';
import AppError from '../../Errors/AppError';
import httpStatus from '../../shared/http-status';
import { IAuthUser, IPaginationOptions } from '../../types';
import { OfferStatus } from '../offer/offer.interface';
import OfferModel from '../offer/offer.model';
import TopupModel from '../topup/topup.model';
import {
  CreateOrderPayload,
  OrdersFilterPayload,
  OrderStatus,
  PaymentStatus,
  ProductCategory,
} from './order.interface';
import OrderModel from './order.model';
import { objectId } from '../../helpers';
import { calculatePagination } from '../../helpers/paginationHelper';
import { UserRole } from '../user/user.interface';

class OrderService {
  async createOrderIntoDB(authUser: IAuthUser, payload: CreateOrderPayload) {
    const { productId, packageId, category, quantity, fieldsInfo } = payload;
    let product;
    let productData;
    if (category === ProductCategory.TOP_UP) {
      product = await TopupModel.findById(productId);
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Topup not found');
      }
      const pkg = product.packages.find((_) => _._id.toString() === packageId);
      if (!pkg) throw new AppError(httpStatus.NOT_FOUND, 'Package not found');

      productData = {
        productId,
        name: product.name,
        package: pkg.name,
        image: product.coverPhoto,
        price: pkg.price,
        quantity,
      };
    } else {
      product = await OfferModel.findById(productId);
      if (!product || product.status !== OfferStatus.Running) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offer not found');
      }
      productData = {
        productId,
        name: product.name,
        image: product.coverPhoto,
        price: product.price,
        quantity,
      };
    }

    return await OrderModel.create({
      customerId: authUser.userId,
      product: productData,
      fieldsInfo,
      payment: {
        amount: productData.price * quantity,
        status: PaymentStatus.UNPAID,
      },
      status: OrderStatus.PENDING,
    });
  }

  async getOrdersFromDB(filterPayload: OrdersFilterPayload, paginationOptions: IPaginationOptions) {
    const { id, customerId, minAmount, maxAmount, status, ...restPayload } = filterPayload;
    const whereConditions: Record<string, any> = {
      ...restPayload,
    };
    if (id) {
      if (!Types.ObjectId.isValid(id)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');
      }
      whereConditions._id = objectId(id);
    } else if (customerId) {
      if (!Types.ObjectId.isValid(customerId)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid  customerId');
      }
      whereConditions.customerId = objectId(customerId);
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

    // if (!status) {
    //     whereConditions.status = {
    //         $nin:[OrderStatus.PENDING,OrderStatus.FAILED]
    //     }
    // }

    const { page, skip, limit, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const transactions = await OrderModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate(['customerId'])
      .lean();
    const totalResults = await OrderModel.countDocuments(whereConditions);

    const total = await OrderModel.countDocuments();
    const data: any[] = transactions.map((transaction) => {
      const { customerId, ...rest } = transaction;
      return {
        ...rest,
        customerId: customerId._id,
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

  async getMyOrdersFromDB(
    authUser: IAuthUser,
    filterPayload: OrdersFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
    const { id, minAmount, maxAmount, status, ...restPayload } = filterPayload;
    const whereConditions: Record<string, any> = {
      customerId: objectId(authUser.userId),
      ...restPayload,
    };
    if (id) {
      if (!Types.ObjectId.isValid(id)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');
      }
      whereConditions._id = objectId(id);
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

    // if (!status) {
    //     whereConditions.status = {
    //         $nin:[OrderStatus.PENDING,OrderStatus.FAILED]
    //     }
    // }

    const { page, skip, limit, sortBy, sortOrder } = calculatePagination(paginationOptions);
    const orders = await OrderModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalResults = await OrderModel.countDocuments(whereConditions);

    const total = await OrderModel.countDocuments();
    const data: any[] = orders;
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

  async getOrderByIdFromDB(authUser: IAuthUser, id: string) {
    const existingOrder = await OrderModel.findById(id).populate(['customerId']).lean();

    if (!existingOrder) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Access control
    if (
      authUser.role === UserRole.CUSTOMER &&
      authUser.userId !== existingOrder.customerId.toString()
    ) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Format response
    const { customerId, ...rest } = existingOrder;
    return {
      ...rest,
      customerId: customerId._id,
      customer: customerId,
    } as any;
  }
}

export default new OrderService();
