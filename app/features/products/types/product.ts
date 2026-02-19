export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  currency: string;
  description: string | null;
  short_description: string | null;
  image: string | null;
  images?: string[];
  is_linked_to_stock: boolean;
  purchase_option: string | null;
  is_sold: boolean;
  category_id?: number;
}

export interface ProductFilters {
  category_id?: number;
  search?: string;
  page?: number;
  per_page?: number;
}
