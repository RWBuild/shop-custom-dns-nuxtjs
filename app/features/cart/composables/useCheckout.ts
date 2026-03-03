import type { CartItem } from '../types/cart.types';
import { parseLaravelError } from '~/features/shared/utils';

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CheckoutPayload {
  description: string;
  customer: CheckoutCustomer;
  products: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface CheckoutResponse {
  success: boolean;
  message?: string;
  data?: {
    invoice_id?: number;
    invoice_number?: string;
    payment_url?: string;
  };
}

export function useCheckout() {
  const { shopFetch } = useShopApi();

  const isSubmitting = ref(false);
  const error = ref<string | null>(null);
  const checkoutResponse = ref<CheckoutResponse | null>(null);

  function transformCartItems(items: CartItem[]): CheckoutPayload['products'] {
    return items.map((item) => ({
      product_id: Number(item.productId),
      quantity: item.quantity,
    }));
  }

  async function createInvoice(
    customer: CheckoutCustomer,
    items: CartItem[],
    description: string = ''
  ): Promise<CheckoutResponse> {
    isSubmitting.value = true;
    error.value = null;
    checkoutResponse.value = null;

    const payload: CheckoutPayload = {
      description,
      customer,
      products: transformCartItems(items),
    };

    try {
      const response = await shopFetch<CheckoutResponse>('/api/shops/create-invoice', {
        method: 'POST',
        body: payload,
      });

      checkoutResponse.value = response;
      return response;
    } catch (err) {
      const errorMessage = parseLaravelError(err, 'Failed to create invoice');
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      isSubmitting.value = false;
    }
  }

  function reset() {
    isSubmitting.value = false;
    error.value = null;
    checkoutResponse.value = null;
  }

  return {
    isSubmitting: readonly(isSubmitting),
    error: readonly(error),
    checkoutResponse: readonly(checkoutResponse),
    createInvoice,
    reset,
  };
}
