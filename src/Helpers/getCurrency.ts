import ICurrency from 'Entities/ICurrency';

export function getCurrency(
  currencies: ICurrency[],
  id: string,
): ICurrency | undefined {
  return currencies.find(currency => currency.id === id);
}

export function getCurrencyName(currencies: ICurrency[], id: string): string {
  const currency = currencies.find(c => c.id === id);
  if (!currency) {
    return id;
  }
  return currency.acronym;
}

export function getCurrencyDollarRate(
  currencies: ICurrency[],
  id: string,
): number {
  const currency = currencies.find(c => c.id === id);
  if (!currency) {
    return 1;
  }
  return currency.dollar_rate;
}
