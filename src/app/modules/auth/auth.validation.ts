import { z } from 'zod';

const customerSignupValidation = z.object({
  name: z.object({
    first: z.string().nonempty().max(25),
    last: z.string().nonempty().max(25),
  }),
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
