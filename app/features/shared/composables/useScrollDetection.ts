export function useScrollDetection(threshold = 0) {
  const isScrolled = ref(false);

  function handleScroll() {
    isScrolled.value = window.scrollY > threshold;
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return {
    isScrolled: readonly(isScrolled),
  };
}
