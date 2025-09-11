import { ObjectId } from 'mongoose';
import { AccountStatus, Provider } from '../user/user.interface';
import { Name } from '../../types/model.type';

export interface Customer {
  _id: ObjectId;
  name: Name;
  fullName: string;
  profilePicture?: string;
  wallet: ObjectId;
  ordersCount: number;
  phone?: string;
  email?: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  provider: Provider;
  passwordLastChangedAt: Date;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPayload
  extends Pick<
    Customer,
    'name' | 'email' | 'password' | 'googleId' | 'facebookId' | 'profilePicture'
  > {
  provider: Provider;
}

export interface CustomersFilterPayload
  extends Partial<{
    searchTerm: string;
    email: string;
    fullName: string;
    status: AccountStatus;
  }> {}

export interface ChangeCustomerStatusPayload {
  id: string;
  status: AccountStatus;
}
