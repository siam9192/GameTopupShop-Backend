import envConfig from '../../config/env.config';
import AppError from '../../Errors/AppError';
import { objectId } from '../../helpers';
import bycryptHelpers from '../../helpers/bycryptHelpers';
import jwtHelpers from '../../helpers/jwtHelpers';
import httpStatus from '../../shared/http-status';
import { FacebookProfile, GoogleProfile } from '../../types/provider.type';
import AdministratorModel from '../administrator/administrator.model';
import { CreateCustomerPayload } from '../customer/customer.interface';
import CustomerModel from '../customer/customer.model';
import customerService from '../customer/customer.service';
import { AccountStatus, Provider, UserRole } from '../user/user.interface';

import { AuthUser, CallbackPayload, ChangePasswordPayload, SigninPayload } from './auth.interface';

class AuthService {
  async customerSignup(payload: CreateCustomerPayload) {
    return await customerService.createCustomer(payload);
  }
  async customerSignin(payload: SigninPayload) {
    // Find the user by email
    const customer = await CustomerModel.findOne({
      email: payload.email,
    }).select('_id email password');

    // Throw an error if the user is not found
    if (!customer) {
      throw new AppError(httpStatus.NOT_FOUND, 'Account not found');
    }
    // Check if the account is blocked
    if (customer.status === AccountStatus.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, 'Access denied: account is blocked');
    }

    // Compare the provided password with the stored hashed password
    const isMatchPassword = await bycryptHelpers.compare(
      payload.password,
      customer.password as string
    );

    if (!isMatchPassword) {
      throw new AppError(httpStatus.NOT_FOUND, 'Wrong password!');
    }

    // Prepare the token payload
    const tokenPayload = {
      userId: customer._id,
      role: UserRole.CUSTOMER,
    };

    // Generate access token
    const accessToken = await jwtHelpers.generateToken(
      tokenPayload,
      envConfig.jwt.accessTokenSecret as string,
      envConfig.jwt.accessTokenExpireTime as string
    );

    // Generate refresh token
    const refreshToken = await jwtHelpers.generateToken(
      tokenPayload,
      envConfig.jwt.refreshTokenSecret as string,
      envConfig.jwt.refreshTokenExpireTime as string
    );

    // Return the tokens
    return {
      accessToken,
      refreshToken,
    };
  }

  async administratorSignIn(payload: SigninPayload) {
    // Find the user by email
    const administrator = await AdministratorModel.findOne({
      email: payload.email,
    }).select('_id email password level');

    // Throw an error if the user is not found
    if (!administrator) {
      throw new AppError(httpStatus.NOT_FOUND, 'Account not found');
    }
    // Check if the account is blocked
    if (administrator.status === AccountStatus.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, 'Access denied: account is blocked');
    }

    // Compare the provided password with the stored hashed password
    const isMatchPassword = await bycryptHelpers.compare(payload.password, administrator.password);

    if (!isMatchPassword) {
      throw new AppError(httpStatus.NOT_FOUND, 'Wrong password!');
    }

    // Prepare the token payload
    const tokenPayload = {
      userId: administrator._id,
      role: administrator.level,
    };

    // Generate access token
    const accessToken = await jwtHelpers.generateToken(
      tokenPayload,
      envConfig.jwt.accessTokenSecret as string,
      envConfig.jwt.accessTokenExpireTime as string
    );

    // Generate refresh token
    const refreshToken = await jwtHelpers.generateToken(
      tokenPayload,
      envConfig.jwt.refreshTokenSecret as string,
      envConfig.jwt.refreshTokenExpireTime as string
    );

    // Return the tokens
    return {
      accessToken,
      refreshToken,
    };
  }

  async changePassword(authUser: AuthUser, payload: ChangePasswordPayload) {
    let password;
    if (authUser.role === UserRole.CUSTOMER) {
      // Find the user by ID and include the password field
      const customer = await CustomerModel.findById(authUser.userId, { password: true });

      // Check if user exists
      if (!customer) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User not found.');
      }

      password = customer.password;
    } else {
      password = '1234';
    }

    // Compare old password
    const isPasswordMatch = await bycryptHelpers.compare(payload.oldPassword, password as string);
    if (!isPasswordMatch) {
      throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Incorrect current password.');
    }
    // Hash the new password
    const newHashedPassword = await bycryptHelpers.hash(payload.newPassword);

    // Update the password
    const updateResult = await CustomerModel.updateOne(
      { _id: objectId(authUser.userId) },
      { password: newHashedPassword }
    );

    if (!updateResult.modifiedCount) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update password.');
    }
    // Return success (can be null or a success message)
    return null;
  }

  async getNewAccessToken(refreshToken: string) {
    try {
      // Step 1: Ensure refresh token exists
      if (!refreshToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Refresh token is required.');
      }

      // Step 2: Verify and decode the token
      const decoded = jwtHelpers.verifyToken(
        refreshToken,
        envConfig.jwt.refreshTokenSecret as string
      ) as AuthUser;

      if (!decoded || !decoded.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token.');
      }
      // Step 3: Create a new access token
      const newAccessToken = await jwtHelpers.generateToken(
        {
          id: decoded.userId,
          role: decoded.role,
        },
        envConfig.jwt.accessTokenSecret as string,
        envConfig.jwt.accessTokenExpireTime as string
      );

      // Step 4: Return both tokens
      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired refresh token.');
    }
  }

  async callback(payload: CallbackPayload) {
    let customer;
    if (payload.provider === 'google') {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${payload.access_token}`,
        },
      });
      const profile: GoogleProfile = await res.json();

      customer = await CustomerModel.findOne({
        email: profile.email,
        status: { $ne: AccountStatus.DELETED },
      });
      if (!customer) {
        customer = await customerService.createCustomer({
          email: profile.email,
          googleId: profile.sub,
          name: {
            first: profile.given_name,
            last: profile.family_name,
          },
          provider: Provider.GOOGLE,
          profilePicture: profile.picture,
        });
      }
    } else if (payload.provider === 'facebook') {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${payload.access_token}`,
        },
      });
      const profile: FacebookProfile = await res.json();

      customer = await CustomerModel.findOne({
        facebookId: profile.id,
        status: { $ne: AccountStatus.DELETED },
      });
      if (!customer) {
        customer = await customerService.createCustomer({
          facebookId: profile.id,
          name: {
            first: profile.first_name!,
            last: profile.last_name || '',
          },
          provider: Provider.FACEBOOK,
        });
      }
    }

    // Prepare the token payload
    const tokenPayload = {
      userId: customer!._id,
      role: UserRole.CUSTOMER,
    };

    // Generate access token
    const accessToken = await jwtHelpers.generateToken(
      tokenPayload,
      envConfig.jwt.accessTokenSecret as string,
      envConfig.jwt.accessTokenExpireTime as string
    );

    // Generate refresh token
    const refreshToken = await jwtHelpers.generateToken(
      tokenPayload,
      envConfig.jwt.refreshTokenSecret as string,
      envConfig.jwt.refreshTokenExpireTime as string
    );

    const result = {
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
