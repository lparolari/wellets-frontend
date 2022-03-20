import { Skeleton } from '@chakra-ui/react';
import Balance from 'Components/Molecules/Balance/Balance';
import Table from 'Components/Molecules/Table';
import ITransaction from 'Entities/ITransaction';
import compareDate from 'Helpers/compareDate';
import formatDate from 'Helpers/formatDate';
import useBaseCurrencyData from 'Hooks/useBaseCurrencyData';
import useTransactionData from 'Hooks/useTransactionData';
import React, { useEffect, useState } from 'react';

interface IProps {
  walletId: string;
  updateTransactions: number;
}

const TransactionHistory: React.FC<IProps> = ({
  walletId,
  updateTransactions,
}) => {
  const [page, setPage] = useState(1);

  const { baseCurrency } = useBaseCurrencyData();
  const { fetchTransactions, transactions, limit, total, isLoading } =
    useTransactionData(walletId);

  useEffect(() => {
    fetchTransactions(page);
  }, [fetchTransactions, updateTransactions, page]);

  return baseCurrency ? (
    <Skeleton isLoaded={!isLoading}>
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
          {
            title: 'Equivalent',
            key: 'equivalent',
            render(transaction: ITransaction) {
              const { value, dollar_rate } = transaction;
              return (
                <Balance
                  balance={value}
                  dollar_rate={dollar_rate / baseCurrency.dollar_rate}
                  currency={baseCurrency.acronym}
                />
              );
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
  ) : null;
};

export default TransactionHistory;
