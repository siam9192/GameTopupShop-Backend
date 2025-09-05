import { z } from 'zod';
import { AppStatus } from './app-setting.interface';

// Helpers
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId');

const url = z.string().url();
const optionalUrl = url.optional();

export const updateAppSettingValidation = z
  .object({
    name: z.string().min(1).optional(),
    logo: url.optional(),
    favicon: optionalUrl,
    description: z.string().optional(),

    supportEmail: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    currency: objectId.optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),

    socialLinks: z
      .object({
        facebook: optionalUrl,
        twitter: optionalUrl,
        instagram: optionalUrl,
        linkedin: optionalUrl,
        youtube: optionalUrl,
      })
      .partial()
      .optional(),

    notification: z
      .object({
        enableCustomerNotification: z.boolean().optional(),
        enableAdministratorNotification: z.boolean().optional(),
      })
      .optional(),

    order: z
      .object({
        enableTopupOrder: z.boolean().optional(),
        enableOfferOrder: z.boolean().optional(),
      })
      .optional(),

    wallet: z
      .object({
        enableAddBalance: z.boolean().optional(),
        enableWalletSubmission: z.boolean().optional(),
      })
      .optional(),

    status: z.nativeEnum(AppStatus).optional(),
  })
  .strict()
  // prevent empty update payloads like {}
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided for update.',
  });

// If you want a TS type from this schema:
export type UpdateAppSettingDTO = z.infer<typeof updateAppSettingValidation>;

const appSettingValidations = {
  updateAppSettingValidation,
};
export default appSettingValidations;
