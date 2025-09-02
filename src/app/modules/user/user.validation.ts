import { z } from 'zod';

const updateCustomerProfileValidation = z
  .object({
    name: z.object({
      first: z.string().nonempty().max(25),
      last: z.string().nonempty().max(25),
    }),
    profilePicture: z.string().url(),
    phone: z.string().nonempty().max(40),
  })
  .partial();

const updateAdministratorProfileValidation = z
  .object({
    name: z.object({
      first: z.string().nonempty().max(25),
      last: z.string().nonempty().max(25),
    }),
    profilePicture: z.string().url(),
  })
  .partial();

const userValidations = {
  updateCustomerProfileValidation,
  updateAdministratorProfileValidation,
};

export default userValidations;
