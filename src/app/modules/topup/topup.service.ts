import { Types } from 'mongoose';
import AppError from '../../Errors/AppError';
import httpStatus from '../../shared/http-status';
import { IAuthUser, IPaginationOptions } from '../../types';
import {
  CreateTopupPayload,
  TopupsFilterPayload,
  TopupStatus,
  UpdateTopupPayload,
  UpdateTopupStatusPayload,
} from './topup.interface';
import TopupModel from './topup.model';
import { platform } from 'os';
import { calculatePagination } from '../../helpers/paginationHelper';
import { objectId } from '../../helpers';
import { UserRole } from '../user/user.interface';

class TopupService {
  async createTopupIntoDB(payload: CreateTopupPayload) {
    const startFrom = Math.min(...payload.packages.map((p) => p.price));
    return await TopupModel.create({
      ...payload,
      startFrom,
    });
  }

  async updateTopupIntoDB(id: string, payload: UpdateTopupPayload) {
    const existingTopup = await TopupModel.findById(id);
    if (!existingTopup) throw new AppError(httpStatus.NOT_FOUND, 'Topup not found');
    const startFrom = payload.packages
      ? Math.min(...payload.packages.map((p) => p.price))
      : existingTopup.startFrom;
    return await TopupModel.findByIdAndUpdate(id, {
      ...payload,
      startFrom,
    });
  }

  async updateTopupStatusIntoDB(payload: UpdateTopupStatusPayload) {
    const { id, status } = payload;
    const existingTopup = await TopupModel.findById(id);
    if (!existingTopup) throw new AppError(httpStatus.NOT_FOUND, 'Topup not found');

    return await TopupModel.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );
  }

  async topupSoftDeleteFormDB(id: string) {
    const existingTopup = await TopupModel.findById(id);
    if (!existingTopup) throw new AppError(httpStatus.NOT_FOUND, 'Topup not found');
    await TopupModel.findByIdAndUpdate(id, { status: TopupStatus.DELETED }, { new: true });
    return null;
  }

  async getTopupsFromDB(filterPayload: TopupsFilterPayload, paginationOptions: IPaginationOptions) {
    const { searchTerm, ...otherFilterPayload } = filterPayload;
    let whereConditions: any = {};
    if (searchTerm) {
      if (Types.ObjectId.isValid(searchTerm)) {
        whereConditions._id = searchTerm;
      } else {
        whereConditions.$or = [
          {
            name: { $regex: searchTerm, $options: 'i' },
          },
          {
            platform: { $regex: searchTerm, $options: 'i' },
          },
          {
            description: { $regex: searchTerm, $options: 'i' },
          },
        ];
      }
    } else if (Object.keys(otherFilterPayload).length) {
      whereConditions = otherFilterPayload;
    }

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions, {
      limitOverride: 20,
    });

    const topups = await TopupModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalResults = await TopupModel.countDocuments(whereConditions);

    const total = await TopupModel.countDocuments();

    return {
      data: topups,
      meta: {
        page,
        limit,
        totalResults,
        total,
      },
    };
  }
  async getPublicTopupsFromDB(
    filterPayload: TopupsFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
    const { searchTerm, ...otherFilterPayload } = filterPayload;
    let whereConditions: any = {
      status: TopupStatus.ACTIVE,
    };
    if (searchTerm) {
      if (Types.ObjectId.isValid(searchTerm)) {
        whereConditions._id = searchTerm;
      } else {
        whereConditions.$or = [
          {
            name: { $regex: searchTerm, $options: 'i' },
          },
          {
            platform: { $regex: searchTerm, $options: 'i' },
          },
          {
            description: { $regex: searchTerm, $options: 'i' },
          },
        ];
      }
    } else if (Object.keys(otherFilterPayload).length) {
      whereConditions = otherFilterPayload;
    }

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const topups = await TopupModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalResults = await TopupModel.countDocuments(whereConditions);

    const total = await TopupModel.countDocuments();

    return {
      data: topups,
      meta: {
        page,
        limit,
        totalResults,
        total,
      },
    };
  }

  async getTopupByIdFromDB(authUser: IAuthUser | undefined, id: string) {
    const existingTopup = await TopupModel.findOne({
      _id: objectId(id),
      status: { $not: TopupStatus.DELETED },
    });
    if (!existingTopup) throw new AppError(httpStatus.NOT_FOUND, 'Topup not found');
    if (
      (!authUser || authUser?.role === UserRole.CUSTOMER) &&
      existingTopup.status !== TopupStatus.ACTIVE
    ) {
      throw new AppError(httpStatus.NOT_FOUND, 'Topup not found');
    }

    return existingTopup;
  }

  async getFeaturedTopupsFromDB(paginationOptions: IPaginationOptions) {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
    const topups = await TopupModel.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    const totalResults = await TopupModel.countDocuments();
    const total = await TopupModel.countDocuments();
    return {
      data: topups,
      meta: {
        page,
        limit,
        totalResults,
        total,
      },
    };
  }
  async getTopTopupsFromDB(paginationOptions: IPaginationOptions) {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
    const topups = await TopupModel.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    const totalResults = await TopupModel.countDocuments();
    const total = await TopupModel.countDocuments();
    return {
      data: topups,
      meta: {
        page,
        limit,
        totalResults,
        total,
      },
    };
  }
}

export default new TopupService();
