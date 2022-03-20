import ITransaction from 'Entities/ITransaction';
import { useCallback, useState } from 'react';
import api from 'Services/api';

import { useErrors } from './errors';

const useTransactionData = (walletId: string) => {
  const { handleErrors } = useErrors();

  const [isLoading, setLoading] = useState(false);

  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [transactions, setTransactions] = useState([] as ITransaction[]);

  const fetchTransactions = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const response = await api.get('/transactions', {
          params: {
            limit,
            page,
            wallet_id: walletId,
          },
        });
        setTransactions(response.data.transactions);
        setTotal(response.data.total);
      } catch (err) {
        handleErrors('Error when fetching transactions', err);
      } finally {
        setLoading(false);
      }
    },
    [handleErrors, limit, walletId],
  );

  const revertTransaction = async (transaction: ITransaction) => {
    try {
      setLoading(true);
      api.post<ITransaction>(`/transactions/${transaction.id}/revert`, {
        value: transaction.value * -1,
        wallet_id: transaction.wallet_id,
        dollar_rate: transaction.dollar_rate,
        description: `Reverted ${transaction.description}`,
      });
    } catch (err) {
      handleErrors('Error reverting transaction', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchTransactions,
    revertTransaction,
    transactions,
    limit,
    total,
    isLoading,
    setLimit,
  };
};

export default useTransactionData;
