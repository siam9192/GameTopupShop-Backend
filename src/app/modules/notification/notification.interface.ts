import { Types } from 'mongoose';
import { x } from 'pdfkit';

export interface Notification {
  customerId: Types.ObjectId | string; // ObjectId or string (if converted)
  administratorId: Types.ObjectId | string;
  title: string;
  message: string;
  link?: string;
  visitId?: string;
  category: NotificationCategory;
  type: NotificationType;
  isRead: boolean; // changed to boolean

  createdAt: Date; // optional timestamp
  updatedAt: Date; // optional timestamp
}

export enum NotificationType {
  INFO = 'Info',
  SUCCESS = 'Success',
  WARNING = 'Warning',
}
export enum NotificationCategory {
  SYSTEM = 'System', // General system updates
  CUSTOMER = 'Customer', // Customer-related notifications
  ADMIN = 'Admin', // Admin-related alerts
  PAYMENT = 'Payment', // Payment success/failure
  ORDER = 'Order', // Order status updates
  WALLET_SUBMISSION = 'Wallet_Submission',
  PROMOTION = 'Promotion', // Discounts, offers, campaigns
}
