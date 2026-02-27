function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  const r = parseInt(result[1] ?? '0', 16) / 255;
  const g = parseInt(result[2] ?? '0', 16) / 255;
  const b = parseInt(result[3] ?? '0', 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateColorPalette(baseColor: string): Record<string, string> {
  const { h, s } = hexToHsl(baseColor);

  return {
    '50': hslToHex(h, Math.min(s, 30), 97),
    '100': hslToHex(h, Math.min(s, 40), 94),
    '200': hslToHex(h, Math.min(s, 50), 86),
    '300': hslToHex(h, Math.min(s, 60), 75),
    '400': hslToHex(h, Math.min(s, 70), 62),
    '500': hslToHex(h, s, 50),
    '600': hslToHex(h, s, 42),
    '700': hslToHex(h, s, 34),
    '800': hslToHex(h, s, 26),
    '900': hslToHex(h, s, 18),
    '950': hslToHex(h, s, 10),
  };
}

export function useTheme() {
  const config = useRuntimeConfig();

  const fontFamily = config.public.fontFamily as string;
  const primaryColor = config.public.primaryColor as string;

  const colorPalette = computed(() => generateColorPalette(primaryColor));

  const themeStyles = computed(() => {
    const palette = colorPalette.value;
    return `
      :root {
        --font-sans: '${fontFamily}', ui-sans-serif, system-ui, sans-serif;
        --ui-primary: ${primaryColor};
        --ui-color-primary-50: ${palette['50']};
        --ui-color-primary-100: ${palette['100']};
        --ui-color-primary-200: ${palette['200']};
        --ui-color-primary-300: ${palette['300']};
        --ui-color-primary-400: ${palette['400']};
        --ui-color-primary-500: ${palette['500']};
        --ui-color-primary-600: ${palette['600']};
        --ui-color-primary-700: ${palette['700']};
        --ui-color-primary-800: ${palette['800']};
        --ui-color-primary-900: ${palette['900']};
        --ui-color-primary-950: ${palette['950']};
        --color-primary-50: ${palette['50']};
        --color-primary-100: ${palette['100']};
        --color-primary-200: ${palette['200']};
        --color-primary-300: ${palette['300']};
        --color-primary-400: ${palette['400']};
        --color-primary-500: ${palette['500']};
        --color-primary-600: ${palette['600']};
        --color-primary-700: ${palette['700']};
        --color-primary-800: ${palette['800']};
        --color-primary-900: ${palette['900']};
        --color-primary-950: ${palette['950']};
        --color-primary: ${primaryColor};
      }
    `;
  });

  return {
    fontFamily,
    primaryColor,
    colorPalette,
    themeStyles,
  };
}
