export interface ManualPaymentMethod {
  name: string;
  logo: string;
  numbers: string[];
  status: ManualPaymentMethodStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum ManualPaymentMethodStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DELETED = 'Deleted',
}

export type CreateManualPaymentMethodPayload = Pick<
  ManualPaymentMethod,
  'name' | 'logo' | 'numbers'
>;

export type UpdateManualPaymentMethodPayload = Partial<
  Pick<ManualPaymentMethod, 'name' | 'logo' | 'numbers'>
>;

export type UpdateManualPaymentMethodStatusPayload = {
  id: string;
  status: ManualPaymentMethodStatus;
};

export type ManualPaymentMethodsFilterPayload = Partial<{
  searchTerm: string;
  name: string;
  status: ManualPaymentMethodStatus;
}>;
