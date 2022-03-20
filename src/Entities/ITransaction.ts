import IWallet from './IWallet';

interface ITransaction {
  id: string;
  wallet_id: string;
  value: number;
  dollar_rate: number;
  description: string;
  created_at: Date;
  updated_at: Date;
  wallet: IWallet;
}

export default ITransaction;
