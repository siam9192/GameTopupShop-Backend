import { startSession, Types } from 'mongoose';
import AppError from '../../Errors/AppError';
import httpStatus from '../../shared/http-status';
import {
  ChangeCustomerStatusPayload,
  CreateCustomerPayload,
  CustomersFilterPayload,
} from './customer.interface';
import CustomerModel from './customer.model';
import bcrypt from 'bcrypt';
import WalletModel from '../wallet/wallet.model';
import { IPaginationOptions } from '../../types';
import { calculatePagination } from '../../helpers/paginationHelper';
import { objectId } from '../../helpers';
import { AccountStatus } from '../user/user.interface';

class CustomerService {
  async createCustomer(payload: CreateCustomerPayload) {
    const { name, email, password, googleId, facebookId } = payload;

    let query: any = {};
    let newCustomer: any = { name, fullName: name.first + ' ' + name.last, email };

    if (email && password) {
      query = { email };
      newCustomer.password = await bcrypt.hash(password, 10);
    } else if (googleId) {
      query = { googleId };
      newCustomer.googleId = googleId;
    } else if (facebookId) {
      query = { facebookId };
      newCustomer.facebookId = facebookId;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid customer payload');
    }

    const isExist = await CustomerModel.findOne(query);
    if (isExist) {
      throw new AppError(httpStatus.FORBIDDEN, 'Already exist');
    }

    const session = await startSession();
    session.startTransaction();

    try {
      const createdCustomer = (await CustomerModel.create([newCustomer], { session }))[0];
      if (!createdCustomer) throw new Error();
      const createdWallet = await WalletModel.create(
        [
          {
            customerId: createdCustomer._id,
            balance: 0,
          },
        ],
        { session }
      );

      if (!createdWallet) throw new Error();
      await session.commitTransaction();

      return await CustomerModel.findOne({
        _id: createdCustomer.id,
      });
    } catch (error) {
      await session.abortTransaction();
      throw new AppError(httpStatus.BAD_REQUEST, 'Create account failed');
    } finally {
      await session.endSession();
    }
  }

  async getCustomersFromDB(payload: CustomersFilterPayload, paginationOptions: IPaginationOptions) {
    const { searchTerm, ...otherFilterPayload } = payload;
    let whereConditions: any = {};
    if (searchTerm) {
      if (Types.ObjectId.isValid(searchTerm)) {
        whereConditions._id = searchTerm;
      } else {
        whereConditions.$or = [
          {
            fullName: { $regex: searchTerm, $options: 'i' },
          },

          {
            email: searchTerm,
          },
        ];
      }
    } else if (Object.keys(otherFilterPayload).length) {
      whereConditions = otherFilterPayload;
    }

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions, {
      limitOverride: 20,
    });

    const customers = await CustomerModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalResults = await CustomerModel.countDocuments(whereConditions);

    const total = await CustomerModel.countDocuments();

    return {
      data: customers,
      meta: {
        page,
        limit,
        totalResults,
        total,
      },
    };
  }

  async getCustomerByIdFromDB(id: string) {
    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');

    // Fetch data
    const customer = await CustomerModel.findOne({
      _id: objectId(id),
      status: { $not: AccountStatus.DELETED },
    });

    // Check existence
    if (!customer) throw new AppError(httpStatus.NOT_FOUND, 'Customer not found');

    return customer;
  }

  async changeCustomerStatusIntoDB(payload: ChangeCustomerStatusPayload) {
    const { id, status } = payload;

    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');

    // Validate status
    if (!Object.values(AccountStatus).includes(status) || status === AccountStatus.DELETED) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid status');
    }

    // Fetch data
    const customer = await CustomerModel.findOne({
      _id: objectId(id),
      status: { $not: AccountStatus.DELETED },
    });

    // Check existence
    if (!customer) throw new AppError(httpStatus.NOT_FOUND, 'Customer not found');

    await CustomerModel.updateOne(
      {
        _id: customer._id,
      },
      { status }
    );
  }
  async updateCustomerProfile() {}
}

export default new CustomerService();
