import ICurrency from 'Entities/ICurrency';
import { useCallback, useEffect, useState } from 'react';
import api from 'Services/api';

import { useErrors } from '../../../Hooks/errors';

type Statistics = {
  average_load_price: number;
  base_currency: ICurrency;
};

export const useFetchStatistics = (walletId: string) => {
  const { handleErrors } = useErrors();

  const [isFetching, setFetching] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>();

  const fetchCurrencies = useCallback(async () => {
    setFetching(true);
    api
      .get<Statistics>(`/wallets/${walletId}/average-load-price`)
      .then(response => setStatistics(response.data))
      .catch(err => handleErrors('Error when fetching user settings', err))
      .finally(() => setFetching(false));
  }, [handleErrors, walletId]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return {
    statistics,
    isFetching,
  };
};
