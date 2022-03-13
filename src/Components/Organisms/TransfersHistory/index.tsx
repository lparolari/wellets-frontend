import { Skeleton } from '@chakra-ui/react';
import Balance from 'Components/Molecules/Balance/Balance';
import Table from 'Components/Molecules/Table';
import ITransfer from 'Entities/ITransfer';
import compareDate from 'Helpers/compareDate';
import formatDate from 'Helpers/formatDate';
import { useErrors } from 'Hooks/errors';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from 'Services/api';

interface IProps {
  walletId: string;
  updateTransfers: number;
}

const TransfersHistory: React.FC<IProps> = ({ walletId, updateTransfers }) => {
  const { handleErrors } = useErrors();

  const limit = useMemo(() => 5, []);

  const [transfers, setTransfers] = useState([] as ITransfer[]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTransfers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/transfers', {
        params: {
          limit,
          page,
          wallet_id: walletId,
        },
      });
      setTransfers(response.data.transfers);
      setTotal(response.data.total);
    } catch (err) {
      handleErrors('Error when fetching transfers', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [limit, page, walletId, updateTransfers, handleErrors]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  return (
    <Skeleton isLoaded={!loading}>
      <Table
        rows={transfers}
        columns={[
          {
            title: 'Date',
            key: 'created_at',
            render(transfer: ITransfer) {
              return formatDate(transfer.created_at);
            },
            sort(a: ITransfer, b: ITransfer) {
              return compareDate(a.created_at, b.created_at);
            },
          },
          {
            title: 'Value',
            key: 'value',
            render(transfer: ITransfer) {
              const { value, from_wallet } = transfer;
              return (
                <Balance
                  balance={value}
                  currency={from_wallet.currency.acronym}
                />
              );
            },
            sort(a: ITransfer, b: ITransfer) {
              return a.value - b.value;
            },
          },
          {
            title: 'Fee',
            key: 'fee',
            render(transfer: ITransfer) {
              const { static_fee, percentual_fee, value, from_wallet } =
                transfer;
              const fee =
                Number(static_fee) +
                (Number(percentual_fee) / 100) * Number(value);
              return (
                <Balance
                  balance={fee}
                  currency={from_wallet.currency.acronym}
                />
              );
            },
            sort(a: ITransfer, b: ITransfer) {
              const a_fee =
                Number(a.static_fee) +
                (Number(a.percentual_fee) / 100) * Number(a.value);
              const b_fee =
                Number(b.static_fee) +
                (Number(b.percentual_fee) / 100) * Number(b.value);

              return a_fee - b_fee;
            },
          },
          {
            title: 'Filled',
            key: 'filled',
            render(transfer: ITransfer) {
              const currency = transfer.to_wallet.currency.acronym;
              const { filled } = transfer;

              return <Balance balance={Number(filled)} currency={currency} />;
            },
            sort: (a: ITransfer, b: ITransfer) => {
              const a_dollar_rate = a.to_wallet.currency.dollar_rate;
              const b_dollar_rate = b.to_wallet.currency.dollar_rate;

              return a.filled / a_dollar_rate - b.filled / b_dollar_rate;
            },
          },
          {
            title: 'From',
            key: 'from',
            render(transfer: ITransfer) {
              const { from_wallet } = transfer;
              if (!from_wallet || !from_wallet.currency) {
                return '';
              }
              const { alias, acronym } = from_wallet.currency;
              return `${alias} (${acronym})`;
            },
          },
          {
            title: 'To',
            key: 'to',
            render(transfer: ITransfer) {
              const { to_wallet } = transfer;
              if (!to_wallet || !to_wallet.currency) {
                return '';
              }
              const { alias, acronym } = to_wallet.currency;
              return `${alias} (${acronym})`;
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

export default TransfersHistory;
