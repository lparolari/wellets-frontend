import IWallet from './IWallet';

interface IPortfolio {
  id: string;
  alias: string;
  weight: number;
  parent?: IPortfolio;
  children: IPortfolio[];
  wallets: IWallet[];
}

export default IPortfolio;
