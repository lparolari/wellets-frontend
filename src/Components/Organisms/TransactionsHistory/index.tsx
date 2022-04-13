import { Skeleton, Stack } from '@chakra-ui/react';
import Button from 'Components/Atoms/Button';
import Balance from 'Components/Molecules/Balance/Balance';
import BalanceBadge from 'Components/Molecules/Balance/BalanceBadge';
import Table from 'Components/Molecules/Table';
import ITransaction from 'Entities/ITransaction';
import compareDate from 'Helpers/compareDate';
import { changeFrom2 } from 'Helpers/converter';
import formatDate from 'Helpers/formatDate';
import useBaseCurrencyData from 'Hooks/useBaseCurrencyData';
import useTransactionData from 'Hooks/useTransactionData';
import React, { useEffect, useState } from 'react';

interface IProps {
  walletId: string;
  updateTransactions: number;
  onSelected?: (transaction: ITransaction) => void;
}

const TransactionHistory: React.FC<IProps> = ({
  walletId,
  updateTransactions,
  onSelected,
}) => {
  const [page, setPage] = useState(1);

  const { baseCurrency } = useBaseCurrencyData();
  const {
    fetchTransactions,
    revertTransaction,
    transactions,
    limit,
    total,
    isLoading,
  } = useTransactionData(walletId);

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
                <>
                  <Balance balance={value} currency={wallet.currency.acronym} />
                  <BalanceBadge
                    balance={value}
                    dollar_rate={changeFrom2(
                      wallet.currency.dollar_rate,
                      baseCurrency.dollar_rate,
                    )}
                    currency={baseCurrency.acronym}
                  />
                </>
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
                  currency={baseCurrency.acronym}
                  dollar_rate={changeFrom2(
                    dollar_rate,
                    baseCurrency.dollar_rate,
                  )}
                />
              );
            },
          },
          {
            title: 'Change rate',
            key: 'change_rate',
            render(transaction: ITransaction) {
              const { dollar_rate } = transaction;
              return (
                <Balance
                  balance={1}
                  currency={baseCurrency.acronym}
                  dollar_rate={changeFrom2(
                    dollar_rate,
                    baseCurrency.dollar_rate,
                  )}
                />
              );
            },
          },
          {
            title: 'Action',
            key: 'action',
            render(transaction: ITransaction) {
              const canRevert = !transaction.description.startsWith('Sent to');

              return (
                <Stack direction="row">
                  <Button onClick={() => onSelected && onSelected(transaction)}>
                    Edit
                  </Button>
                  {canRevert ? (
                    <Button
                      onClick={() => {
                        revertTransaction(transaction).then(() =>
                          fetchTransactions(page),
                        );
                      }}
                    >
                      Revert
                    </Button>
                  ) : null}
                </Stack>
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
