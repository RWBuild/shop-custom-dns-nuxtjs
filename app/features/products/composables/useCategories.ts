import type { ApiResponse } from '~/features/shared/types/api';
import type { Category } from '~/features/products/types/category';

export function useCategories() {
  const config = useRuntimeConfig();

  const {
    data: categoriesResponse,
    status,
    error,
    refresh,
  } = useFetch<ApiResponse<Category[]>>('/api/categories', {
    baseURL: config.public.posBaseUrl as string,
    lazy: true,
  });

  const categories = computed(() => categoriesResponse.value?.data ?? []);

  const isLoading = computed(() => status.value === 'pending');

  return {
    categories,
    isLoading,
    error,
    refresh,
  };
}
