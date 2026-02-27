export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
  additional: unknown[];
}

export interface Category {
  id: number;
  name: string;
}

export type CategoriesResponse = PaginatedResponse<Category>;

export interface ProductImage {
  id: number;
  is_default: boolean;
  type: 'image' | 'video';
  url: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  currency: string;
  description: string | null;
  short_description: string | null;
  image: string;
  is_linked_to_stock: boolean;
  purchase_option: string | null;
  is_sold: boolean;
  images?: ProductImage[];
  product_type_id?: number;
  product_type?: {
    id: number;
    name: string;
  };
}

export interface ProductListItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  is_sold: boolean;
  product_type_id?: number;
}

export type ProductsResponse = PaginatedResponse<ProductListItem>;

export interface AnalyticHubPayload {
  wallet_shop_slug: string;
  analytic_type: string;
  search_value?: {
    search_product_name?: string;
    product_type_id?: number;
  };
}

export type CategoryAnalyticType = 'ListWalletShopProductTypeSearchHandler';
export type ProductAnalyticType = 'ListWalletShopProductSearchHandler';
