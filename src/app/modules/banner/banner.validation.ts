import { z } from 'zod';
import { BannerStatus } from './banner.interface';

const createBannerValidation = z.object({
  image: z.string().url(),
  link: z.string().url(),
});

const updateBannerValidation = z
  .object({
    image: z.string().url(),
    link: z.string().url(),
    status: z.nativeEnum(BannerStatus),
  })
  .partial();

const bannerValidations = {
  createBannerValidation,
  updateBannerValidation,
};

export default bannerValidations;
