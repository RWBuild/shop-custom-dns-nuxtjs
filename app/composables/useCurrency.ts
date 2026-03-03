import {
  addCurrency as addCurrencyUtil,
  divideCurrency as divideCurrencyUtil,
  formatCurrency as formatCurrencyUtil,
  multiplyCurrency as multiplyCurrencyUtil,
  parseCurrency as parseCurrencyUtil,
  subtractCurrency as subtractCurrencyUtil,
} from '~/features/shared/utils';

export function useCurrency() {
  const { shopCurrency } = useShopInfo();

  const currencyCode = computed(() => shopCurrency.value || 'RWF');

  const formatPrice = (value: number, code?: string): string => {
    return formatCurrencyUtil(value, code || currencyCode.value);
  };

  const parsePrice = (value: string, code?: string): number => {
    return parseCurrencyUtil(value, code || currencyCode.value);
  };

  const addPrice = (a: number, b: number, code?: string): number => {
    return addCurrencyUtil(a, b, code || currencyCode.value);
  };

  const subtractPrice = (a: number, b: number, code?: string): number => {
    return subtractCurrencyUtil(a, b, code || currencyCode.value);
  };

  const multiplyPrice = (value: number, multiplier: number, code?: string): number => {
    return multiplyCurrencyUtil(value, multiplier, code || currencyCode.value);
  };

  const dividePrice = (value: number, divisor: number, code?: string): number => {
    return divideCurrencyUtil(value, divisor, code || currencyCode.value);
  };

  return {
    currencyCode,
    formatPrice,
    parsePrice,
    addPrice,
    subtractPrice,
    multiplyPrice,
    dividePrice,
  };
}
