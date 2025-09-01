import { ObjectId } from 'mongoose';
import { AccountStatus, Provider } from '../User/user.interface';

export interface Administrator {
  _id: ObjectId;
  fullName: string;
  profilePicture: string;
  email: string;
  password: string;
  passwordLastChangedAt: Date;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}
