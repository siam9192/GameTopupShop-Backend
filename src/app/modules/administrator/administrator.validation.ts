import { z } from 'zod';
import { AccountStatus, AdministratorLevel } from '../user/user.interface';

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

const updateAdministratorStatusIntoDB = z.object({
  id: z.string().nonempty(),
  status: z.nativeEnum(AccountStatus),
});

const updateAdministratorLevelIntoDB = z.object({
  id: z.string().nonempty(),
  status: z.nativeEnum(AdministratorLevel),
});

const administratorValidations = {
  createAdministratorValidation,
  updateAdministratorStatusIntoDB,
  updateAdministratorLevelIntoDB,
};

export default administratorValidations;
