import { ObjectId } from 'mongoose';
import { Name } from '../../types/model.type';

interface User {
  _id: ObjectId;
  email: string;
  password: string;
  googleId: string;
  facebookId: string;
  provider: Provider;
  passwordLastChangedAt: Date;
  createdAt: string;
  updatedAt: string;
}

interface ICustomer {
  _id: ObjectId;
  fullName: string;
  profilePicture: string;
  ordersCount: number;
  email: string;
  password: string;
  googleId: string;
  facebookId: string;
  provider: Provider;
  passwordLastChangedAt: Date;
  createdAt: string;
  updatedAt: string;
}

interface Administrator {
  _id: ObjectId;
  fullName: string;
  profilePicture: string;
  level: AdministratorLevel;
  email: string;
  password: string;
  passwordLastChangedAt: Date;
  createdAt: string;
  updatedAt: string;
}

interface ICustomerWallet {
  _id: ObjectId;
  customerId: ObjectId;
  balance: ObjectId;
  createdAt: string;
  updatedAt: string;
}

interface IWalletHistory {
  _id: ObjectId;
  walletId: ObjectId;
  title: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export enum Provider {
  GOOGLE = 'Google',
  EMAIL_PASSWORD = 'Email_Password',
  FACEBOOK = 'Facebook',
}

export enum AdministratorLevel {
  SUPER_ADMIN = 'Super_Admin',
  ADMIN = 'Admin',
  MODERATOR = 'Moderator',
}

export enum AccountStatus {
  ACTIVE = 'Active',
  BLOCKED = 'Blocked',
  DELETED = 'Deleted',
}

export enum UserRole {
  CUSTOMER = 'Customer',
  SUPER_ADMIN = 'Super_Admin',
  ADMIN = 'Admin',
  MODERATOR = 'Moderator',
}

export interface UpdateUserProfilePayload {
  name: Name;
  profilePicture: string;
  phone: string;
}

export interface UpdateCustomerProfilePayload {
  name: Name;
  profilePicture: string;
  phone: string;
}

export interface UpdateAdministratorProfilePayload {
  name: Name;
  profilePicture: string;
}
