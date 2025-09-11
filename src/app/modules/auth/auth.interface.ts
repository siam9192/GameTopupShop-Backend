import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../user/user.interface';

export interface AuthUser extends JwtPayload {
  role: UserRole;
  id: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface CallbackPayload {
  provider: 'google' | 'facebook';
  type: string;
  access_token: string;
  expires_at: number;
  scope: string;
  token_type: string;
  id_token: string;
}
