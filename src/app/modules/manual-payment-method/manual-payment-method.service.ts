import { Types } from 'mongoose';
import AppError from '../../Errors/AppError';
import { objectId } from '../../helpers';
import httpStatus from '../../shared/http-status';
import { IPaginationOptions } from '../../types';
import {
  CreateManualPaymentMethodPayload,
  ManualPaymentMethodsFilterPayload,
  ManualPaymentMethodStatus,
  UpdateManualPaymentMethodStatusPayload,
} from './manual-payment-method.interface';
import ManualPaymentMethodModel from './manual-payment-method.model';
import { calculatePagination } from '../../helpers/paginationHelper';
class ManualPaymentMethodService {
  // ✅ Create a new manual payment method
  async createMethodIntoDB(payload: CreateManualPaymentMethodPayload) {
    // Check if a method already exists with the same name
    const method = await ManualPaymentMethodModel.findOne({
      name: payload.name,
      status: { $nt: ManualPaymentMethodStatus.DELETED },
    });
    if (method) {
      throw new AppError(httpStatus.FORBIDDEN, 'Method already exists using this name');
    }

    // Create new method if not exists
    return await ManualPaymentMethodModel.create(payload);
  }

  // ✅ Update an existing manual payment method
  async updateMethodIntoDB(id: string, payload: Partial<CreateManualPaymentMethodPayload>) {
    // First, check if the method exists
    const method = await ManualPaymentMethodModel.findOne({
      _id: objectId(id),
      status: { $nt: ManualPaymentMethodStatus.DELETED },
    });
    if (!method) {
      throw new AppError(httpStatus.NOT_FOUND, 'Method not found');
      // 🔹 Suggestion: use NOT_FOUND (404) instead of FORBIDDEN (403) here
    }

    // If name is being changed, ensure the new name is unique
    if (payload.name && method.name !== payload.name) {
      const existing = await ManualPaymentMethodModel.findOne({
        _id: objectId(id),
        status: { $nt: ManualPaymentMethodStatus.DELETED },
      });
      if (existing) {
        throw new AppError(httpStatus.FORBIDDEN, 'Method already exists using this name');
      }
    }

    // Update and return the updated document
    return await ManualPaymentMethodModel.findByIdAndUpdate(id, payload, { new: true });
  }

  async softDeleteMethodFromDB(id: string) {
    const method = await ManualPaymentMethodModel.findOne({
      _id: objectId(id),
      status: { $nt: ManualPaymentMethodStatus.DELETED },
    });
    if (!method) {
      throw new AppError(httpStatus.NOT_FOUND, 'Method not found');
    }

    return await ManualPaymentMethodModel.findByIdAndUpdate(
      id,
      { status: ManualPaymentMethodStatus.DELETED },
      { new: true }
    );
  }

  async updateMethodStatus(payload: UpdateManualPaymentMethodStatusPayload) {
    const { id, status } = payload;
    const method = await ManualPaymentMethodModel.findById(id);
    if (!method) throw new AppError(httpStatus.NOT_FOUND, 'Method not found');
    return await ManualPaymentMethodModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async getPubicMethodsFromDB(
    filterPayload: ManualPaymentMethodsFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
    const { searchTerm, ...otherFilterPayload } = filterPayload;
    let whereConditions: any = {
      status: ManualPaymentMethodStatus.ACTIVE,
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
            numbers: { $regex: searchTerm, $options: 'i' },
          },
        ];
      }
    } else if (Object.keys(otherFilterPayload).length) {
      whereConditions = otherFilterPayload;
    }

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions, {
      limitOverride: 20,
    });

    const customers = await ManualPaymentMethodModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalResults = await ManualPaymentMethodModel.countDocuments(whereConditions);

    const total = await ManualPaymentMethodModel.countDocuments();

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

  async getMethodsFromDB(
    filterPayload: ManualPaymentMethodsFilterPayload,
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
            name: { $regex: searchTerm, $options: 'i' },
          },
          {
            numbers: { $regex: searchTerm, $options: 'i' },
          },
        ];
      }
    } else if (Object.keys(otherFilterPayload).length) {
      whereConditions = otherFilterPayload;
    }

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions, {
      limitOverride: 20,
    });

    const customers = await ManualPaymentMethodModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalResults = await ManualPaymentMethodModel.countDocuments(whereConditions);

    const total = await ManualPaymentMethodModel.countDocuments();

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

  async getMethodByIdFromDB(id: string) {
    // ✅ Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid ID format');
    }

    // ✅ Find method
    const method = await ManualPaymentMethodModel.findById(id);
    if (!method) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment method not found');
    }

    return method;
  }
}

export default new ManualPaymentMethodService();
