export function useTheme() {
  const config = useRuntimeConfig();

  const fontFamily = config.public.fontFamily as string;

  const themeStyles = computed(() => `
    :root {
      --font-sans: '${fontFamily}', ui-sans-serif, system-ui, sans-serif;
    }
  `);

  return {
    fontFamily,
    themeStyles,
  };
}
