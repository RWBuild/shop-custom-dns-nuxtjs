import currency from 'currency.js';

export type CurrencyCode = 'RWF' | 'USD' | 'EUR' | 'GBP';

interface CurrencyConfig {
  symbol: string;
  precision: number;
  pattern: string;
  separator: string;
  decimal: string;
}

const currencyConfigs: Record<CurrencyCode, CurrencyConfig> = {
  RWF: {
    symbol: 'RWF',
    precision: 0,
    pattern: '# !',
    separator: ',',
    decimal: '.',
  },
  USD: {
    symbol: '$',
    precision: 2,
    pattern: '!#',
    separator: ',',
    decimal: '.',
  },
  EUR: {
    symbol: '€',
    precision: 2,
    pattern: '# !',
    separator: ' ',
    decimal: ',',
  },
  GBP: {
    symbol: '£',
    precision: 2,
    pattern: '!#',
    separator: ',',
    decimal: '.',
  },
};

function getCurrencyOptions(code: CurrencyCode): currency.Options {
  const config = currencyConfigs[code];
  return {
    symbol: config.symbol,
    precision: config.precision,
    pattern: config.pattern,
    separator: config.separator,
    decimal: config.decimal,
  };
}

export function formatCurrency(value: number, code: CurrencyCode = 'RWF'): string {
  return currency(value, getCurrencyOptions(code)).format();
}

export function parseCurrency(value: string, code: CurrencyCode = 'RWF'): number {
  return currency(value, getCurrencyOptions(code)).value;
}

export function addCurrency(a: number, b: number, code: CurrencyCode = 'RWF'): number {
  return currency(a, getCurrencyOptions(code)).add(b).value;
}

export function subtractCurrency(a: number, b: number, code: CurrencyCode = 'RWF'): number {
  return currency(a, getCurrencyOptions(code)).subtract(b).value;
}

export function multiplyCurrency(value: number, multiplier: number, code: CurrencyCode = 'RWF'): number {
  return currency(value, getCurrencyOptions(code)).multiply(multiplier).value;
}

export function divideCurrency(value: number, divisor: number, code: CurrencyCode = 'RWF'): number {
  return currency(value, getCurrencyOptions(code)).divide(divisor).value;
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
