import { z } from 'zod';
const ChangePasswordValidation = z.object({
  oldPassword: z.string().nonempty('Old password is required'),
  newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(32, { message: 'Password must be at least 6 characters and Maximum 32 characters longs' }),
});
const customerSignupValidation = z.object({
  fullName: z.string().nonempty().max(50),
  email: z.string().email().max(100),
  password: z.string().min(6).max(50),
});

const customerSignInValidation = z.object({
  email: z.string().email().max(100),
  password: z.string().min(6).max(50),
});

const changePasswordValidation = z.object({
  oldPassword: z.string().nonempty('Old password is required'),
  newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(32, { message: 'Password must be at least 6 characters and Maximum 32 characters longs' }),
});

const authValidations = {
  customerSignInValidation,
  customerSignupValidation,
  changePasswordValidation,
};

export default authValidations;
