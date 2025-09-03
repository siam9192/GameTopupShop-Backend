import { z } from 'zod';
import { TopupInfoFieldType, TopupPackageStatus, TopupStatus } from './topup.interface';

const createTopupValidation = z.object({
  name: z.string().nonempty().max(200),
  platformName: z.string().nonempty().max(50),
  packages: z.array(
    z.object({
      name: z.string().nonempty().max(100),
      price: z.number().min(0),
      status: z.nativeEnum(TopupPackageStatus),
    })
  ),
  coverPhoto: z.string().url(),
  description: z.string().nonempty(),

  infoFields: z.array(
    z.object({
      name: z.string().nonempty().max(100),
      placeholder: z.string().nonempty().max(100).optional(),
      type: z.nativeEnum(TopupInfoFieldType),
      minLength: z.number().nonnegative(),
      maxLength: z.number().nonnegative(),
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
      optional: z.boolean(),
    })
  ),
});

const updateTopupValidation = createTopupValidation.partial();

const updateTopupStatus = z.object({
  id: z.string(),
  status: z.nativeEnum(TopupStatus),
});

const topupValidations = {
  createTopupValidation,
  updateTopupValidation,
  updateTopupStatus,
};

export default topupValidations;
