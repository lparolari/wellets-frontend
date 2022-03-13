interface ICreateTransactionDTO {
  wallet_id: string;
  value: number;
  description: string;
  dollar_rate?: number;
}

export default ICreateTransactionDTO;
