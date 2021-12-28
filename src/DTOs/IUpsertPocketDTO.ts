import { IOption } from 'Components/Atoms/Select';

interface IUpsertPocketDTO {
  alias: string;
  weight: number;
  parent_id?: string;
  wallet_ids?: string[];
}

export default IUpsertPocketDTO;
