import { IOption } from 'Components/Atoms/Select';

interface IFormPortfolioDTO {
  alias: string;
  weight: number;
  parent?: IOption;
  wallets?: IOption[];
}

export default IFormPortfolioDTO;
