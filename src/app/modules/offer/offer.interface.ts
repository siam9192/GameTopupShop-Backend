export interface Offer {
  name: string;
  platformName: string;
  startDate: Date;
  endDate: Date;
  price: number;
  coverPhoto: string;
  description: string;
  infoFields: OfferInfoField[];
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OfferInfoField = {
  name: string;
  placeholder?: string;
  type: OfferInfoFieldType;
  minLength?: number;
  maxLength: number;
  min?: number;
  max?: number;
  optional: boolean;
};

export enum OfferInfoFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
}

export enum OfferStatus {
  PENDING = 'Pending',
  Running = 'Running',
  Paused = 'Paused',
  ENDED = 'Ended',
  DELETED = 'DELETED',
}

export interface CreateOfferPayload
  extends Pick<Offer, 'name' | 'platformName' | 'coverPhoto' | 'description' | 'infoFields'> {
  startDate: string;
  endDate: string;
}

export type UpdateOfferPayload = Partial<CreateOfferPayload>;

export interface UpdateOfferStatusPayload {
  id: string;
  status: OfferStatus;
}

export type OffersFilterPayload = Partial<
  Pick<Offer, 'name' | 'platformName' | 'status'> & {
    searchTerm: string;
    startDate: string;
    endDate: string;
  }
>;
