export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface SeoDefaults {
  titleTemplate?: string;
  defaultImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export interface StoreConfig {
  name: string;
  tagline?: string;
  description?: string;
  keywords?: string[];
  logo?: string;
  favicon?: string;
  contact?: ContactInfo;
  social?: SocialLinks;
  seo?: SeoDefaults;
}
