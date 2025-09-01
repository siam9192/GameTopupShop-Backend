import { Types } from 'mongoose';
import AppError from '../../Errors/AppError';
import bycryptHelpers from '../../helpers/bycryptHelpers';
import httpStatus from '../../shared/http-status';
import { IPaginationOptions } from '../../types';
import CustomerModel from '../customer/customer.model';
import { AccountStatus, AdministratorLevel } from '../User/user.interface';
import {
  AdministratorsFilterPayload,
  ChangeAdministratorLevelPayload,
  ChangeAdministratorStatusPayload,
  CreateAdministratorPayload,
} from './administrator.interface';
import AdministratorModel from './administrator.model';
import { calculatePagination } from '../../helpers/paginationHelper';
import { objectId } from '../../helpers';

class AdministratorService {
  async createAdministratorIntoDB(payload: CreateAdministratorPayload) {
    const { name, email, password } = payload;
    // Check user existence

    const customer = await CustomerModel.findOne({
      email,
      status: {
        $nt: AccountStatus.DELETED,
      },
    });

    if (customer) throw new AppError(httpStatus.FORBIDDEN, 'This email is already used');

    const administrator = await AdministratorModel.findOne({
      email,
      status: {
        $nt: AccountStatus.DELETED,
      },
    });

    if (administrator) throw new AppError(httpStatus.FORBIDDEN, 'This email is already used');

    const hashedPassword = await bycryptHelpers.hash(password);

    return await AdministratorModel.create({
      ...payload,
      fullName: name.first + ' ' + name.last,
      password: hashedPassword,
    });
  }

  async getAdministratorsFromDB(
    payload: AdministratorsFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
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

    const customers = await AdministratorModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalResults = await AdministratorModel.countDocuments(whereConditions);

    const total = await AdministratorModel.countDocuments();

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

  async getAdministratorByIdFromDB(id: string) {
    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');

    // Fetch data
    const administrator = await AdministratorModel.findOne({
      _id: objectId(id),
      status: { $not: AccountStatus.DELETED },
    });

    // Check existence
    if (!administrator) throw new AppError(httpStatus.NOT_FOUND, 'Customer not found');

    return administrator;
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

  async changeAdministratorLevel(payload: ChangeAdministratorLevelPayload) {
    const { id, level } = payload;

    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');

    // Validate status
    if (!Object.values(AdministratorLevel).includes(level)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid level');
    }

    // Fetch data
    const administrator = await AdministratorModel.findOne({
      _id: objectId(id),
      status: { $not: AccountStatus.DELETED },
    });

    // Check existence
    if (!administrator) throw new AppError(httpStatus.NOT_FOUND, 'Administrator not found');

    if (administrator.level === payload.level) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid level');
    }

    await AdministratorModel.updateOne(
      {
        _id: administrator._id,
      },
      { level }
    );
  }

  async changeAdministratorStatusIntoDB(payload: ChangeAdministratorStatusPayload) {
    const { id, status } = payload;

    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');

    // Validate status
    if (!Object.values(AccountStatus).includes(status) || status === AccountStatus.DELETED) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid status');
    }

    // Fetch data
    const administrator = await AdministratorModel.findOne({
      _id: objectId(id),
      status: { $not: AccountStatus.DELETED },
    });

    // Check existence
    if (!administrator) throw new AppError(httpStatus.NOT_FOUND, 'Administrator not found');

    await AdministratorModel.updateOne(
      {
        _id: administrator._id,
      },
      { status }
    );
  }
}
