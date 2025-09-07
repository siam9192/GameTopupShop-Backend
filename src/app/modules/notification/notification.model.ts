import { model, Model, Schema } from 'mongoose';
import { Notification, NotificationCategory, NotificationType } from './notification.interface';

const NotificationModelSchema = new Schema<Notification>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null },
    administratorId: {
      type: Schema.Types.ObjectId,
      ref: 'Administrator',
      default: null,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: null },
    visitId: { type: String, default: null },

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
    isRead: { type: Boolean, default: false },
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
