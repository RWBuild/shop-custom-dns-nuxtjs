import type { ApiResponse } from '~/features/shared/types/api';
import type { Product, ProductFilters } from '~/features/products/types/product';

export function useProducts(filters?: Ref<ProductFilters> | ProductFilters) {
  const config = useRuntimeConfig();

  const reactiveFilters = isRef(filters) ? filters : ref(filters ?? {});

  const {
    data: productsResponse,
    status,
    error,
    refresh,
  } = useFetch<ApiResponse<Product[]>>('/api/products', {
    baseURL: config.public.posBaseUrl as string,
    query: reactiveFilters,
    lazy: true,
    watch: [reactiveFilters],
  });

  const products = computed(() => productsResponse.value?.data ?? []);

  const pagination = computed(() => productsResponse.value?.meta ?? null);

  const isLoading = computed(() => status.value === 'pending');

  return {
    products,
    pagination,
    isLoading,
    error,
    refresh,
  };
}

export function useProductsByCategory(categoryId: Ref<number | null>) {
  const config = useRuntimeConfig();

  const {
    data: productsResponse,
    status,
    error,
    refresh,
  } = useFetch<ApiResponse<Product[]>>('/api/products', {
    baseURL: config.public.posBaseUrl as string,
    query: computed(() => ({
      category_id: categoryId.value,
    })),
    lazy: true,
    watch: [categoryId],
    immediate: false,
  });

  const products = computed(() => productsResponse.value?.data ?? []);

  const isLoading = computed(() => status.value === 'pending');

  return {
    products,
    isLoading,
    error,
    refresh,
  };
}
