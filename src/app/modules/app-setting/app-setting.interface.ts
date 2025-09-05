import { Types } from 'mongoose';

export interface AppSetting extends Document {
  name: string; // Application name
  logo: string; // Logo URL or path
  favicon?: string; // Favicon URL
  description?: string; // Short app description

  supportEmail?: string; // Support contact email
  phoneNumber?: string; // Support contact phone
  address?: string; // Company/office address
  currency?: string; // Default currency (e.g., USD, BDT)
  timezone?: string; // Default timezone
  language?: string; // Default language
  socialLinks?: {
    // Social media profiles
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  notification: {
    enableCustomerNotification: Boolean;
    enableAdministratorNotification: Boolean;
  };
  order: {
    enableTopupOrder: boolean;
    enableOfferOrder: boolean;
  };
  wallet: {
    enableAddBalance: boolean;
    enableWalletSubmission: boolean;
  };
  appStatus: AppStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum AppStatus {
  OPEN = 'Open', // Application is live and accessible
  CLOSED = 'Closed', // Application is temporarily closed
  MAINTENANCE = 'Maintenance', // Application is under maintenance
  SUSPENDED = 'Suspended', // Application access is suspended
  COMING_SOON = 'Coming Soon', // Application is not launched yet
}

export interface UpdateAppSettingPayload extends Partial<AppSetting> {}
