import { Skeleton } from '@chakra-ui/react';
import Balance from 'Components/Molecules/Balance/Balance';
import Table from 'Components/Molecules/Table';
import ITransaction from 'Entities/ITransaction';
import compareDate from 'Helpers/compareDate';
import formatDate from 'Helpers/formatDate';
import { useErrors } from 'Hooks/errors';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from 'Services/api';

interface IProps {
  walletId: string;
  updateTransactions: number;
}

const TransactionHistory: React.FC<IProps> = ({
  walletId,
  updateTransactions,
}) => {
  const { handleErrors } = useErrors();

  const limit = useMemo(() => 5, []);

  const [transactions, setTransactions] = useState([] as ITransaction[]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
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
    // eslint-disable-next-line
  }, [limit, page, walletId, updateTransactions, handleErrors]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <Skeleton isLoaded={!loading}>
      <Table
        rows={transactions}
        columns={[
          {
            title: 'Date',
            key: 'created_at',
            render(transaction: ITransaction) {
              return formatDate(transaction.created_at);
            },
            sort(a: ITransaction, b: ITransaction) {
              return compareDate(a.created_at, b.created_at);
            },
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: 'Value',
            key: 'value',
            render(transaction: ITransaction) {
              const { value, wallet } = transaction;
              return (
                <Balance balance={value} currency={wallet.currency.acronym} />
              );
            },
            sort(a: ITransaction, b: ITransaction) {
              return a.value - b.value;
            },
          },
        ]}
        pagination={{
          limit,
          total,
          setPage,
          currentPage: page,
        }}
      />
    </Skeleton>
  );
};

export default TransactionHistory;
