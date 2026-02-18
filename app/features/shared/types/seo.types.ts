export interface ProductSeoData {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image?: string;
  sku?: string;
  brand?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

export interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  noIndex?: boolean;
  product?: ProductSeoData;
}

export interface CategorySeoData {
  name: string;
  description?: string;
  image?: string;
}
