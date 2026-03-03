import currency from 'currency.js';

export type CurrencyCode = string;

function normalizeCurrencyCode(code: string): string {
  return code.toUpperCase().trim();
}

const precisionCache = new Map<string, number>();

function getCurrencyPrecision(code: string): number {
  const normalizedCode = normalizeCurrencyCode(code);

  if (precisionCache.has(normalizedCode)) {
    return precisionCache.get(normalizedCode)!;
  }

  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: normalizedCode,
    });
    const parts = formatter.formatToParts(1.11);
    const fractionPart = parts.find((p) => p.type === 'fraction');
    const precision = fractionPart ? fractionPart.value.length : 0;
    precisionCache.set(normalizedCode, precision);
    return precision;
  } catch {
    return 2;
  }
}

export function formatCurrency(
  value: number,
  code: CurrencyCode = 'RWF',
  locale = 'en-US',
): string {
  const normalizedCode = normalizeCurrencyCode(code);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: normalizedCode,
    }).format(value);
  } catch {
    // Fallback for invalid currency codes
    return `${value.toLocaleString(locale)} ${normalizedCode}`;
  }
}

export function parseCurrency(value: string, code: CurrencyCode = 'RWF'): number {
  const precision = getCurrencyPrecision(code);
  return currency(value, { precision }).value;
}

export function addCurrency(a: number, b: number, code: CurrencyCode = 'RWF'): number {
  const precision = getCurrencyPrecision(code);
  return currency(a, { precision }).add(b).value;
}

export function subtractCurrency(a: number, b: number, code: CurrencyCode = 'RWF'): number {
  const precision = getCurrencyPrecision(code);
  return currency(a, { precision }).subtract(b).value;
}

export function multiplyCurrency(
  value: number,
  multiplier: number,
  code: CurrencyCode = 'RWF',
): number {
  const precision = getCurrencyPrecision(code);
  return currency(value, { precision }).multiply(multiplier).value;
}

export function divideCurrency(
  value: number,
  divisor: number,
  code: CurrencyCode = 'RWF',
): number {
  const precision = getCurrencyPrecision(code);
  return currency(value, { precision }).divide(divisor).value;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}

export function parseLaravelError(err: unknown, fallbackMessage: string): string {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data: { message?: string } }).data;
    if (data?.message) {
      return data.message;
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallbackMessage;
}
