import { ObjectId } from 'mongoose';
import { AccountStatus, AdministratorLevel, Provider } from '../User/user.interface';
import { ChangeCustomerStatusPayload } from '../customer/customer.interface';
import { Name } from '../../types/model.type';

export interface Administrator {
  _id: ObjectId;
  name: Name;
  fullName: string;
  profilePicture: string;
  level: AdministratorLevel;
  email: string;
  password: string;
  passwordLastChangedAt: Date;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdministratorPayload
  extends Pick<
    Administrator,
    'name' | 'profilePicture' | 'level' | 'email' | 'password' | 'status'
  > {}

export interface AdministratorsFilterPayload
  extends Partial<Pick<Administrator, 'fullName' | 'email' | 'level'>> {
  searchTerm: string;
}

export interface ChangeAdministratorLevelPayload {
  id: string;
  level: AdministratorLevel;
}

export type ChangeAdministratorStatusPayload = ChangeCustomerStatusPayload;
