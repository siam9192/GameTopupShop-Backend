import { Types } from "mongoose";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import { IAuthUser, IPaginationOptions } from "../../types";
import { CreateOfferPayload, OffersFilterPayload, OfferStatus, UpdateOfferPayload, UpdateOfferStatusPayload } from "./offer.interface";
import OfferModel from "./offer.model";
import { calculatePagination } from "../../helpers/paginationHelper";
import { objectId } from "../../helpers";
import { UserRole } from "../user/user.interface";
import { x } from "pdfkit";

class OfferService {
    async createOfferIntoDB (payload:CreateOfferPayload) {
       const {startDate,endDate} =  payload
       if( new Date().getTime() >  new Date(startDate).getTime()) {
        throw new AppError(httpStatus.FORBIDDEN,"Invalid start date ")
       }
       else if( new Date(endDate).getTime() <  new Date(startDate).getTime()) {
        throw new AppError(httpStatus.FORBIDDEN,"Start date can not be getter than end date ")
       }

       return await OfferModel.create({
        ...payload,
        startDate:new Date(startDate),
        endDate:new Date(endDate),
        status:new Date(startDate).getTime() <= new Date().getTime() ? OfferStatus.Running : OfferStatus.PENDING
       })
    }
   async updateOfferIntoDB(id: string, payload: UpdateOfferPayload) {
  // Validate existence
  const existingOffer = await OfferModel.findById(id);
  if (!existingOffer) {
    throw new AppError(httpStatus.NOT_FOUND, "Offer not found");
  }

  const { startDate, endDate } = payload;

  // Validate start date (cannot update to a past date, except same day)
  if (
    startDate &&
    new Date(startDate).getTime() !== existingOffer.startDate.getTime() &&
    new Date(startDate) < new Date()
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot update offer start date to a past time"
    );
  }

  // Prepare update fields
  const updateData = {
    ...payload,
    startDate: startDate ? new Date(startDate) : existingOffer.startDate,
    endDate: endDate ? new Date(endDate) : existingOffer.endDate,
  };

  // Update and return the latest document
  return await OfferModel.findByIdAndUpdate(id, updateData, { new: true });
   }

  async updateOfferStatusIntoDB(payload: UpdateOfferStatusPayload) {
    const { id, status } = payload;
    const existingOffer = await OfferModel.findById(id);
    if (!existingOffer) throw new AppError(httpStatus.NOT_FOUND, 'Offer not found');
    return await OfferModel.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );
  }

   async softDeleteOfferFromDB(id: string) {
     const existingOffer = await OfferModel.findOne({
      _id: objectId(id),
      status: { $not: OfferStatus.DELETED },
    });
    if (!existingOffer) throw new AppError(httpStatus.NOT_FOUND, 'Offer not found');
    await OfferModel.findByIdAndUpdate(id, { status: OfferStatus.DELETED }, { new: true });
    return null;
  }

 async getOffersFromDB(filterPayload: OffersFilterPayload, paginationOptions: IPaginationOptions) {
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

    const topups = await OfferModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalResults = await OfferModel.countDocuments(whereConditions);

    const total = await OfferModel.countDocuments();

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
  async getPublicOffersFromDB(
    filterPayload: OffersFilterPayload,
    paginationOptions: IPaginationOptions
  ) {
    const { searchTerm, ...otherFilterPayload } = filterPayload;
    let whereConditions: any = {
      status: OfferStatus.Running,
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

    const topups = await OfferModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalResults = await OfferModel.countDocuments(whereConditions);

    const total = await OfferModel.countDocuments();

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
  
  async getOfferByIdFromDB(authUser: IAuthUser | undefined, id: string) {
    const existingOffer = await OfferModel.findOne({
      _id: objectId(id),
      status: { $not: OfferStatus.DELETED },
    });
    if (!existingOffer) throw new AppError(httpStatus.NOT_FOUND, 'Offer not found');
    if (
      (!authUser || authUser?.role === UserRole.CUSTOMER) &&
      existingOffer.status !== OfferStatus.Running
    ) {
      throw new AppError(httpStatus.NOT_FOUND, 'Offer not found');
    }

    return existingOffer;
  }
async getEndingSoonOffersFromDB(paginationOptions: IPaginationOptions) {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
    const offers = await OfferModel.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    const totalResults = await OfferModel.countDocuments();
    const total = await OfferModel.countDocuments();
    return {
      data:offers ,
      meta: {
        page,
        limit,
        totalResults,
        total,
      },
    };
  }
 

}

export default new OfferService()