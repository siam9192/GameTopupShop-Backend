import { z } from 'zod';

const notificationsSetAsReadValidation = z.object({
  ids: z.array(z.string().nonempty()).min(1),
});

const notificationsValidations = {
  notificationsSetAsReadValidation,
};

export default notificationsValidations;
