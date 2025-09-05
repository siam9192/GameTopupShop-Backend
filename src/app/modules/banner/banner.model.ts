import { model, Schema } from 'mongoose';
import { Banner, BannerStatus } from './banner.interface';

const BannerModelSchema = new Schema<Banner>(
  {
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BannerStatus),
      default: BannerStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const BannerModel = model<Banner>('Banner', BannerModelSchema);

export default BannerModel;
