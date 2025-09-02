import { IAuthUser } from '../../types';
import AdministratorModel from '../administrator/administrator.model';
import CustomerModel from '../customer/customer.model';
import {
  UpdateAdministratorProfilePayload,
  UpdateCustomerProfilePayload,
  UserRole,
} from './user.interface';

class UserService {
  async updateUserProfileIntoDB(
    authUser: IAuthUser,
    payload: UpdateCustomerProfilePayload | UpdateAdministratorProfilePayload
  ) {
    const role = authUser.role;

    let result;
    if (role === UserRole.CUSTOMER) {
      payload = payload as UpdateCustomerProfilePayload;
      result = await CustomerModel.updateOne(
        {
          _id: authUser.userId,
        },
        payload
      );
    } else {
      payload = payload as UpdateAdministratorProfilePayload;
      result = await AdministratorModel.updateOne(
        {
          _id: authUser.userId,
        },
        payload
      );
    }

    return result;
  }

  async getCurrentUserFromDB(authUser: IAuthUser) {
    const role = authUser.role;

    if (role === UserRole.CUSTOMER) {
      return await CustomerModel.findById(authUser.userId);
    } else return await AdministratorModel.findById(authUser.userId);
  }
}

export default new UserService();
