type CartDrawerView = 'cart' | 'checkout';

const isOpen = ref(false);
const currentView = ref<CartDrawerView>('cart');

export function useCartDrawer() {
  function openDrawer() {
    isOpen.value = true;
    currentView.value = 'cart';
  }

  function closeDrawer() {
    isOpen.value = false;
    currentView.value = 'cart';
  }

  function goToCheckout() {
    currentView.value = 'checkout';
  }

  function goToCart() {
    currentView.value = 'cart';
  }

  return {
    isOpen,
    currentView,
    openDrawer,
    closeDrawer,
    goToCheckout,
    goToCart,
  };
}
