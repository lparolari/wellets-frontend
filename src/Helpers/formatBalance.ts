const defaultOptions = {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'code',
  maximumFractionDigits: 2,
};

const formatBalance = (
  balance: number,
  locales?: string | string[] | undefined,
  options: Intl.NumberFormatOptions = defaultOptions,
): string => balance.toLocaleString(locales, { ...defaultOptions, ...options });

export default formatBalance;
