export interface Banner extends Document {
  image: string;
  link: string;
  status: BannerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum BannerStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export type CreateBannerPayload = Pick<Banner, 'image' | 'link'>;

export type UpdateBannerPayload = Pick<Banner, 'image' | 'link' | 'status'>;
