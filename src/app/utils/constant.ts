import bycryptHelpers from '../helpers/bycryptHelpers';
import { AppStatus } from '../modules/app-setting/app-setting.interface';
import { CurrencyStatus } from '../modules/currency/currency.interface';
import { AccountStatus, AdministratorLevel, UserRole } from '../modules/user/user.interface';

export const PAGINATION_OPTION_KEYS = ['page', 'limit', 'sortBy', 'sortOrder'];

export const ALL_ROLES = Object.values(UserRole) as UserRole[];

export const ALL_ADMINISTRATOR_LEVELS = Object.values(AdministratorLevel) as AdministratorLevel[];

export const GLOBAL_ERROR_MESSAGE =
  'Oops! There is something happened wrong.Please try again later';

export const DEFAULT_APP_SETTING = {
  name: 'My Application',
  logo: '/default-logo.png',
  favicon: '/favicon.ico',
  description: 'Default application settings',

  supportEmail: 'support@example.com',
  phoneNumber: '+8801000000000',
  address: 'Dhaka, Bangladesh',
  currency: null, // Replace with a valid Currency ObjectId if available
  timezone: 'Asia/Dhaka',
  language: 'en',

  socialLinks: {
    facebook: 'https://facebook.com/example',
    twitter: 'https://twitter.com/example',
    instagram: 'https://instagram.com/example',
    linkedin: 'https://linkedin.com/company/example',
    youtube: 'https://youtube.com/@example',
  },

  notification: {
    enableCustomerNotification: true,
    enableAdministratorNotification: true,
  },

  order: {
    enableTopupOrder: true,
    enableOfferOrder: true,
  },

  wallet: {
    enableAddBalance: true,
    enableWalletSubmission: true,
  },

  status: AppStatus.OPEN,
};

export const DEFAULT_CURRENCIES = [
  {
    name: 'Bangladeshi Taka',
    code: 'BDT',
    symbol: '৳',
    status: CurrencyStatus.ACTIVE,
  },
  {
    name: 'United States Dollar',
    code: 'USD',
    symbol: '$',
    status: CurrencyStatus.ACTIVE,
  },
  {
    name: 'Euro',
    code: 'EUR',
    symbol: '€',
    status: CurrencyStatus.ACTIVE,
  },
  {
    name: 'Indian Rupee',
    code: 'INR',
    symbol: '₹',
    status: CurrencyStatus.ACTIVE,
  },
];

export const DEFAULT_SUPER_ADMIN = {
  name: {
    first: 'Arafat Hasan',
    last: 'Siam',
  },
  fullName: 'Arafat Hasan Siam',
  level: AdministratorLevel.SUPER_ADMIN,
  profilePicture:
    'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
  password: bycryptHelpers.hash('123456'),
  email: 'superadmin@gmail.com',
  status: AccountStatus.ACTIVE,
};
