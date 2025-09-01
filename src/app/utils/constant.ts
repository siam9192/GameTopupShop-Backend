import { UserRole } from '../modules/User/user.interface';

export const PAGINATION_OPTION_KEYS = ['page', 'limit', 'sortBy', 'sortOrder'];

export const ALL_ROLES = Object.values(UserRole) as UserRole[];

export const GLOBAL_ERROR_MESSAGE =
  'Oops! There is something happened wrong.Please try again later';
