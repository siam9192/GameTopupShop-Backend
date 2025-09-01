import { z } from 'zod';
import { AdministratorLevel } from '../User/user.interface';

const createAdministratorValidation = z.object({
  name: z.object({
    first: z.string().nonempty().max(25),
    last: z.string().nonempty().max(25),
  }),
  fullName: z.string().nonempty().max(50),
  profilePicture: z.string().url(),
  level: z.nativeEnum(AdministratorLevel),
  email: z.string().email(),
  password: z.string().min(6),
});

const administratorValidations = {
  createAdministratorValidation,
};

export default administratorValidations;
