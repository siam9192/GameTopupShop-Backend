import { z } from 'zod';
import { AccountStatus } from '../user/user.interface';

const changeCustomerStatusValidation = z.object({
  id: z.string().nonempty(),
  status: z.nativeEnum(AccountStatus),
});

const CustomerValidation = {
  changeCustomerStatusValidation,
};

export default CustomerValidation;
