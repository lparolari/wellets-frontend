import { IOption } from 'Components/Atoms/Select';

interface IUpsertPocketDTO {
  alias: string;
  weight: number;
  parent?: IOption;
  wallets?: IOption[];
}

export default IUpsertPocketDTO;
