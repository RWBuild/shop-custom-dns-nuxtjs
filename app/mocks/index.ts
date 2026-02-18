import type { ApiResponse } from '~/features/shared/types/api';
import type { Product } from '~/features/products/types/product';
import type { Category } from '~/features/products/types/category';

import categoriesData from './categories.json';
import productsData from './products.json';
import aboutData from './about.json';
import contactData from './contact.json';

export const mockCategories = categoriesData as ApiResponse<Category[]>;
export const mockProducts = productsData as ApiResponse<Product[]>;
export const mockAbout = aboutData;
export const mockContact = contactData;

export function getMockProducts(): Product[] {
  return mockProducts.data;
}

export function getMockCategories(): Category[] {
  return mockCategories.data;
}

export function getMockProductsByCategory(categoryId: number): Product[] {
  return mockProducts.data.filter((product) => product.category_id === categoryId);
}
