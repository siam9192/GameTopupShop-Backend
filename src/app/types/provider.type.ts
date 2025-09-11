export interface GoogleProfile {
  sub: string; // Google user ID
  name: string; // Full name
  given_name: string; // First name
  family_name: string; // Last name
  picture: string; // Profile picture URL
  email: string; // Email address
  email_verified: boolean; // Whether email is verified
  locale: string; // User's locale (e.g., "en")
}

export interface FacebookProfile {
  id: string; // Facebook user ID
  name: string; // Full name
  email?: string; // Email (may not be available)
  first_name?: string; // First name
  last_name?: string; // Last name
  picture?: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}
