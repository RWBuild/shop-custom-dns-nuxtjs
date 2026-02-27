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
  image: string | null;
  images?: ProductImage[] | string[];
  is_linked_to_stock: boolean;
  purchase_option: string | null;
  is_sold: boolean;
  category_id?: number;
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
  image: string | null;
  is_sold: boolean;
  product_type_id?: number;
}

export interface ProductFilters {
  category_id?: number;
  search?: string;
  page?: number;
  per_page?: number;
}
