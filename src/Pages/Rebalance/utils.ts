import IPortfolio from 'Entities/IPortfolio';
import IWallet from 'Entities/IWallet';

export const isWalletChild = (
  wallet: IWallet,
  portfolio: IPortfolio,
): boolean => portfolio.wallets.filter(w => w.id === wallet.id).length === 0;
