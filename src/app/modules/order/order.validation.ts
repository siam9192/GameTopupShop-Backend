import { z } from 'zod';
import { ProductCategory } from './order.interface';

const createOrderValidation = z
  .object({
    productId: z.string().nonempty(),
    packageId: z.string().nonempty().optional(),
    category: z.nativeEnum(ProductCategory),
    quantity: z.number().min(1),
    fieldsInfo: z.array(
      z.object({
        name: z.string().nonempty(),
        value: z.string().nonempty(),
      })
    ),
  })
  .refine(
    (obj) => {
      // if category is TOP_UP, packageId must be provided
      if (obj.category === ProductCategory.TOP_UP) {
        return !!obj.packageId;
      }
      return true; // for other categories, no restriction
    },
    {
      message: 'packageId is required when category is TOP_UP',
      path: ['packageId'],
    }
  );

const orderValidations = {
  createOrderValidation,
};

export default orderValidations;
