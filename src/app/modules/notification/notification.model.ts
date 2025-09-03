import { model, Model, Schema } from 'mongoose';
import { Notification, NotificationCategory, NotificationType } from './notification.interface';

const NotificationModelSchema = new Schema<Notification>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    administratorId: {
      type: Schema.Types.ObjectId,
      ref: 'Administrator',
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    category: {
      type: String,
      enum: Object.values(NotificationCategory),
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedA
  }
);

const NotificationModel: Model<Notification> = model<Notification>(
  'Notification',
  NotificationModelSchema
);

export default NotificationModel;
