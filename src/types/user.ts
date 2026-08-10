export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;
}

export interface LastSignIn {
  date?: string;
  browser?: string;
  os?: string;
  device?: string;
  isDesktop?: boolean;
  isMobile?: boolean;
}

export interface ImageInfo {
  link?: string;
  name?: string;
}

export interface AvatarInfo {
  bgColor: string;
  textColor: string;
  text: string;
}

export interface User {
  _id: string;
  uid: string;
  userName: string;
  shopId?: string;

  lastSignIn?: LastSignIn;

  isGuest?: boolean;
  acceptMarketing?: boolean;
  signInCount?: number;

  firstName?: string;
  lastName?: string;
  gender?: string;
  phoneNumber?: string;
  salutation?: string;

  disabled?: boolean;

  address?: string;

  isAdmin: boolean;
  isBlogAuthor: boolean;
  isHubAdmin?: boolean;
  isSuperAdmin?: boolean;

  email: string;
  emailVerified?: boolean;
  phoneNumberVerified: boolean;

  creationTime?: string;
  createdBy?: string;

  imageUrl?: ImageInfo;
  avatar?: AvatarInfo;
  social?: SocialLinks;

  dateOfBirth?: string;
  country?: string;
  region?: string;
  postCode?: string;

  isVendor?: boolean;
  points?: number;
  prefferedCurrency?: string;

  source?: string;
  welcomeEmailSent?: boolean;
  initialPointGiven?: boolean;

  hasOrders?: boolean;

  disabledAt?: Date;
  disabledBy?: string;

  expiresAt?: Date;
  authActivity?: {
    lastSignInTime?: string;
    creationTime?: string;
    providerData?: string;
    lastRefreshTime?: string;
  };
}
