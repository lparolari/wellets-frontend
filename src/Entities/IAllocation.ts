import ICurrency from './ICurrency';
import IPortfolio from './IPortfolio';
import IWallet from './IWallet';

export interface IAction {
  type: 'buy' | 'sell';
  amount: number;
}

export interface IChange {
  portfolio: IPortfolio;
  wallets: IWallet[];
  target: number;
  actual: number;
  off_by: number;
  action: IAction;
}

export default interface IAllocation {
  base_currency: ICurrency;
  changes: IChange[];
}
