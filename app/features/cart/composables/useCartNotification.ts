const isAnimating = ref(false);

export function useCartNotification() {
  const toast = useToast();

  function notifyItemAdded(_productName: string) {
    isAnimating.value = true;
    setTimeout(() => {
      isAnimating.value = false;
    }, 600);

    toast.add({
      title: 'Added to cart',
      icon: 'i-lucide-check',
      color: 'neutral',
      duration: 2000,
    });
  }

  return {
    isAnimating: readonly(isAnimating),
    notifyItemAdded,
  };
}
