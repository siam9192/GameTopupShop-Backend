import { skip } from 'node:test';
import { calculatePagination } from '../../helpers/paginationHelper';
import { IPaginationOptions } from '../../types';
import { BannerStatus, CreateBannerPayload, UpdateBannerPayload } from './banner.interface';
import BannerModel from './banner.model';
import { Types } from 'mongoose';
import AppError from '../../Errors/AppError';
import httpStatus from '../../shared/http-status';
import { objectId } from '../../helpers';

class BannerService {
  async createBannerIntoDB(payload: CreateBannerPayload) {
    return await BannerModel.create(payload);
  }

  async updateBannerIntoDB(id: string, payload: UpdateBannerPayload) {
    return await BannerModel.findByIdAndUpdate(id, payload, { new: true });
  }
  async deleteBannerFromDB(id: string) {
    await BannerModel.findByIdAndDelete(id, { new: true });
    return null;
  }

  async getBannersFromDB(paginationOptions: IPaginationOptions) {
    const { page, skip, limit, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const banners = await BannerModel.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    const totalResults = await BannerModel.countDocuments();

    return {
      data: banners,
      meta: {
        page,
        limit,
        totalResults,
      },
    };
  }

  async getPublicBannersFromDB() {
    return await BannerModel.find({ status: BannerStatus.ACTIVE });
  }

  async getBannerByIdFromDB(id: string) {
    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');

    // Fetch data
    const banner = await BannerModel.findOne({
      _id: objectId(id),
    });

    // Check existence
    if (!banner) throw new AppError(httpStatus.NOT_FOUND, 'Banner not found');
    return banner;
  }
}

export default new BannerService();
