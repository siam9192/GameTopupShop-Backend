import { startSession } from 'mongoose';
import AppError from '../../Errors/AppError';
import httpStatus from '../../shared/http-status';
import { CreateCustomerPayload } from './customer.interface';
import CustomerModel from './customer.model';
import bcrypt from 'bcrypt';
import WalletModel from '../wallet/wallet.model';
class CustomerService {
  async createCustomer(payload: CreateCustomerPayload) {
    const { fullName, email, password, googleId, facebookId } = payload;

    let query: any = {};
    let newCustomer: any = { fullName, email };

    if (email && password) {
      query = { email };
      newCustomer.password = await bcrypt.hash(password, 10);
    } else if (googleId) {
      query = { googleId };
      newCustomer.googleId = googleId;
    } else if (facebookId) {
      query = { facebookId };
      newCustomer.facebookId = facebookId;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid customer payload');
    }

    const isExist = await CustomerModel.findOne(query);
    if (isExist) {
      throw new AppError(httpStatus.FORBIDDEN, 'Already exist');
    }

    const session = await startSession();
    session.startTransaction();

    try {
      const createdCustomer = (await CustomerModel.create([newCustomer], { session }))[0];
      if (!createdCustomer) throw new Error();
      const createdWallet = await WalletModel.create(
        [
          {
            customerId: createdCustomer._id,
            balance: 0,
          },
        ],
        { session }
      );

      if (!createdWallet) throw new Error();
      await session.commitTransaction()

      return  await CustomerModel.findOne({
        _id:createdCustomer.id
      })
    } catch (error) {
      await session.abortTransaction();
      throw new AppError(httpStatus.BAD_REQUEST, 'Create account failed');
    } finally {
      await session.endSession();
    }
   
  }
}

export default new CustomerService();
