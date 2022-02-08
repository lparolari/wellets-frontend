import IPortfolio from './IPortfolio';

interface IBalancedPortfolio extends IPortfolio {
  target_value: number;
  actual_value: number;
  off_by: number;
  rebalance_amount: number;
}

export default IBalancedPortfolio;
