import { ObjectId } from 'mongoose';
import { AccountStatus, Provider } from '../User/user.interface';

export interface Customer {
  _id: ObjectId;
  fullName: string;
  profilePicture: string;
  wallet: ObjectId;
  ordersCount: number;
  email: string;
  password: string;
  googleId: string;
  facebookId: string;
  provider: Provider;
  passwordLastChangedAt: Date;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPayload
  extends Pick<Customer, 'fullName' | 'email' | 'password' | 'googleId' | 'facebookId'> {}


  export interface ICustomersFilterPayload extends Partial<{
    searchTerm:string
    email:string
    fullName:string
    status:AccountStatus
  }>{
    
  }

  export interface IChangeCustomerStatusPayload {
    id:string,
    status:AccountStatus
  }