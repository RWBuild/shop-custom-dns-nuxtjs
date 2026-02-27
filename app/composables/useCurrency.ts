import {
  formatCurrency as formatCurrencyUtil,
  parseCurrency as parseCurrencyUtil,
  addCurrency as addCurrencyUtil,
  subtractCurrency as subtractCurrencyUtil,
  multiplyCurrency as multiplyCurrencyUtil,
  divideCurrency as divideCurrencyUtil,
  type CurrencyCode,
} from '~/features/shared/utils';

export function useCurrency() {
  const { shopCurrency } = useShopInfo();

  const currencyCode = computed(() => (shopCurrency.value as CurrencyCode) || 'RWF');

  const formatPrice = (value: number, code?: CurrencyCode): string => {
    return formatCurrencyUtil(value, code || currencyCode.value);
  };

  const parsePrice = (value: string, code?: CurrencyCode): number => {
    return parseCurrencyUtil(value, code || currencyCode.value);
  };

  const addPrice = (a: number, b: number, code?: CurrencyCode): number => {
    return addCurrencyUtil(a, b, code || currencyCode.value);
  };

  const subtractPrice = (a: number, b: number, code?: CurrencyCode): number => {
    return subtractCurrencyUtil(a, b, code || currencyCode.value);
  };

  const multiplyPrice = (value: number, multiplier: number, code?: CurrencyCode): number => {
    return multiplyCurrencyUtil(value, multiplier, code || currencyCode.value);
  };

  const dividePrice = (value: number, divisor: number, code?: CurrencyCode): number => {
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
