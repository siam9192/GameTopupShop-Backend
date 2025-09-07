import { Types } from 'mongoose';
import AppError from '../../Errors/AppError';
import httpStatus from '../../shared/http-status';
import { IPaginationOptions } from '../../types';
import { CreateCurrencyPayload, CurrenciesFilterPayload } from './currency.interface';
import CurrencyModel from './currency.model';
import { calculatePagination } from '../../helpers/paginationHelper';
import { objectId } from '../../helpers';
import AppSettingModel from '../app-setting/app-setting.model';

class CurrencyService {
  async createCurrencyIntoDB(payload: CreateCurrencyPayload) {
    const existByCode = await CurrencyModel.findOne({ code: payload.code });
    if (existByCode) throw new AppError(httpStatus.FORBIDDEN, 'Currency already exist');
    return await CurrencyModel.create(payload);
  }
  async updateCurrencyIntoDB(id: string, payload: Partial<CreateCurrencyPayload>) {
    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');
    // Fetch data
    const currency = await CurrencyModel.findOne({
      _id: objectId(id),
    });
    // Check existence
    if (!currency) throw new AppError(httpStatus.NOT_FOUND, 'Currency not found');

    if (payload.code) {
      const existByCode = await CurrencyModel.findOne({ code: payload.code });
      if (existByCode) throw new AppError(httpStatus.FORBIDDEN, 'Currency already exist');
    }
    return await CurrencyModel.findByIdAndUpdate(id, payload, { new: true });
  }

  async deleteCurrencyFromDB(id: string) {
    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');
    // Fetch data
    const currency = await CurrencyModel.findOne({
      _id: objectId(id),
    });
    // Check existence
    if (!currency) throw new AppError(httpStatus.NOT_FOUND, 'Currency not found');
    const appSetting = await AppSettingModel.findOne();
    if (appSetting!.currency?.toString() === id) {
      new AppError(httpStatus.FORBIDDEN, 'Currency in use,Delete not possible');
    }
    return await CurrencyModel.findByIdAndDelete(id, { new: true });
  }

  async getCurrenciesFromDB(
    filterPayload: CurrenciesFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
    const { searchTerm, ...otherFilterPayload } = filterPayload;
    let whereConditions: any = {};
    if (searchTerm) {
      if (Types.ObjectId.isValid(searchTerm)) {
        whereConditions._id = searchTerm;
      } else {
        whereConditions.$or = [
          {
            code: { $regex: searchTerm, $options: 'i' },
          },

          {
            name: searchTerm,
          },
        ];
      }
    } else if (Object.keys(otherFilterPayload).length) {
      whereConditions = otherFilterPayload;
    }

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions, {
      limitOverride: 20,
    });

    const currencies = await CurrencyModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalResults = await CurrencyModel.countDocuments(whereConditions);

    const total = await CurrencyModel.countDocuments();

    return {
      data: currencies,
      meta: {
        page,
        limit,
        totalResults,
        total,
      },
    };
  }

  async getCurrencyByIdFromDB(id: string) {
    // validate id
    if (!Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id');
    // Fetch data
    const currency = await CurrencyModel.findOne({
      _id: objectId(id),
    });
    // Check existence
    if (!currency) throw new AppError(httpStatus.NOT_FOUND, 'Currency not found');
    return currency;
  }
}

export default new CurrencyService();
