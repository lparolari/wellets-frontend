interface IUpsertPortfolioDTO {
  alias: string;
  weight: number;
  parent_id?: string;
  wallet_ids?: string[];
}

export default IUpsertPortfolioDTO;
