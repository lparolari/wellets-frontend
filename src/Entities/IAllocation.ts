import ICurrency from './ICurrency';
import IPortfolio from './IPortfolio';

export interface IAction {
  type: 'buy' | 'sell';
  amount: number;
}

export interface IChange {
  portfolio: IPortfolio;
  target: number;
  actual: number;
  off_by: number;
  action: IAction;
}

export default interface IAllocation {
  base_currency: ICurrency;
  changes: IChange[];
}
