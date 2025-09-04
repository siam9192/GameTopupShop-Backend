import { Types } from 'mongoose';

export interface Topup extends Document {
  name: string;
  platformName: string;
  startFrom: number;
  packages: TopupPackage[];
  coverPhoto: string;
  description: string;
  infoFields: TopupInfoField[];
  status: TopupStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type TopupPackage = {
  _id: Types.ObjectId;
  name: string;
  price: number;
  status: TopupPackageStatus;
};

export type TopupInfoField = {
  name: string;
  placeholder?: string;
  type: TopupInfoFieldType;
  minLength?: number;
  maxLength: number;
  min?: number;
  max?: number;
  optional: boolean;
};

export enum TopupInfoFieldType {
  TEXT = 'Text',
  NUMBER = 'Number',
  TEXTAREA = 'Textarea',
}

export enum TopupStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DELETED = 'DELETED',
}

export enum TopupPackageStatus {
  AVAILABLE = 'Available',
  UNAVAILABLE = 'Unavailable',
}

export interface CreateTopupPayload
  extends Pick<
    Topup,
    'name' | 'platformName' | 'packages' | 'coverPhoto' | 'description' | 'infoFields'
  > {}

export type UpdateTopupPayload = Partial<CreateTopupPayload>;

export interface UpdateTopupStatusPayload {
  id: string;
  status: TopupStatus;
}

export type TopupsFilterPayload = Partial<
  Pick<Topup, 'name' | 'platformName' | 'status'> & { searchTerm: string }
>;
