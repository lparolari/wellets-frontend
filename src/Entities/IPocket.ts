import IWallet from './IWallet';

interface IPocket {
  id: string;
  alias: string;
  weight: number;
  parent?: IPocket;
  wallets: IWallet[];
}

export default IPocket;
