import type { CartItem, CartSummary } from '../types/cart.types';
import { generateId } from '~/features/shared/utils';

const CART_STORAGE_KEY = 'guh-store-cart';

const cartItems = ref<CartItem[]>([]);
const isLoading = ref(false);
const isInitialized = ref(false);

function persistCart(): void {
  if (import.meta.client) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value));
  }
}

function loadCart(): void {
  if (import.meta.client && !isInitialized.value) {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        cartItems.value = JSON.parse(stored);
      }
    } catch {
      cartItems.value = [];
    }
    isInitialized.value = true;
  }
}

export function useCart() {
  const { trackCartCreated } = useAnalytics();

  onMounted(() => {
    loadCart();
  });

  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
  });

  const cartTotal = computed(() => {
    return cartItems.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  });

  const isEmpty = computed(() => cartItems.value.length === 0);

  const cartSummary = computed<CartSummary>(() => {
    return {
      total: cartTotal.value,
      itemCount: cartCount.value,
    };
  });

  function addItem(item: Omit<CartItem, 'id'>): void {
    const wasEmpty = cartItems.value.length === 0;
    const existingItem = cartItems.value.find(
      (i) => i.productId === item.productId && i.variant === item.variant
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cartItems.value.push({
        ...item,
        id: generateId(),
      });
    }

    if (wasEmpty) {
      trackCartCreated();
    }

    persistCart();
  }

  function removeItem(itemId: string): void {
    const index = cartItems.value.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      cartItems.value.splice(index, 1);
      persistCart();
    }
  }

  function updateQuantity(itemId: string, quantity: number): void {
    const item = cartItems.value.find((i) => i.id === itemId);
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId);
      } else {
        item.quantity = quantity;
        persistCart();
      }
    }
  }

  function clearCart(): void {
    cartItems.value = [];
    persistCart();
  }

  function getItem(productId: string): CartItem | undefined {
    return cartItems.value.find((item) => item.productId === productId);
  }

  function incrementQuantity(itemId: string): void {
    const item = cartItems.value.find((i) => i.id === itemId);
    if (item) {
      item.quantity++;
      persistCart();
    }
  }

  function decrementQuantity(itemId: string): void {
    const item = cartItems.value.find((i) => i.id === itemId);
    if (item) {
      if (item.quantity <= 1) {
        removeItem(itemId);
      } else {
        item.quantity--;
        persistCart();
      }
    }
  }

  return {
    items: cartItems,
    isLoading: readonly(isLoading),
    cartCount,
    cartTotal,
    isEmpty,
    cartSummary,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
    incrementQuantity,
    decrementQuantity,
  };
}
