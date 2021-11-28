import IWallet from 'Entities/IWallet';

export default function formatWalletValue(
  value: number,
  wallet?: IWallet,
  currency?: string,
): string {
  const parsedValue = Number(value.toString());
  if (currency) {
    return `${currency} ${parsedValue}`;
  }
  if (!wallet || !wallet.currency) {
    return parsedValue.toString();
  }
  return `${wallet.currency.acronym} ${parsedValue.toLocaleString()}`;
}
