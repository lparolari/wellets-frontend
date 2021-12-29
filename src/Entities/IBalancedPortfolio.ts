import IPortfolio from './IPocket';

interface IBalancedPortfolio extends IPortfolio {
  target_value: number;
  actual_value: number;
  off_by: number;
  rebalance_amount: number;
}

export default IBalancedPortfolio;
