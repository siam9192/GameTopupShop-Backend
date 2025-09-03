import { AdministratorLevel, UserRole } from '../modules/user/user.interface';

export const PAGINATION_OPTION_KEYS = ['page', 'limit', 'sortBy', 'sortOrder'];

export const ALL_ROLES = Object.values(UserRole) as UserRole[];

export const ALL_ADMINISTRATOR_LEVELS = Object.values(AdministratorLevel) as AdministratorLevel[];

export const GLOBAL_ERROR_MESSAGE =
  'Oops! There is something happened wrong.Please try again later';
