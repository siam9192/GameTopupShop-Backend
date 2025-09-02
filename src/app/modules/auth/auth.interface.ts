import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../user/';
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
