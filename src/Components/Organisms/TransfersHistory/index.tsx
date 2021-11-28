import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@chakra-ui/react';

import Table from 'Components/Molecules/Table';
import Balance from 'Components/Molecules/Balance/Balance';

import ITransfer from 'Entities/ITransfer';
import formatDate from 'Helpers/formatDate';
import api from 'Services/api';
import { useErrors } from 'Hooks/errors';

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
          },
          {
            title: 'Fee',
            key: 'fee',
            render(transfer: ITransfer) {
              const {
                static_fee,
                percentual_fee,
                value,
                from_wallet,
              } = transfer;
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
          },
          {
            title: 'Filled',
            key: 'filled',
            render(transfer: ITransfer) {
              const currency = transfer.to_wallet.currency.acronym;
              const { filled } = transfer;

              return <Balance balance={Number(filled)} currency={currency} />;
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
