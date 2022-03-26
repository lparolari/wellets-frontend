import { useCallback, useEffect, useState } from 'react';
import api from 'Services/api';

import { useErrors } from '../../Hooks/errors';

type Statistics = {
  average_load_price: number;
  base_currency: any;
};

type Context = {
  statistics: Statistics | undefined;
  isFetching: boolean;
};

const useCurrencyData = (walletId: string): Context => {
  const { handleErrors } = useErrors();

  const [isFetching, setFetching] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>();

  const fetchCurrencies = useCallback(async () => {
    setFetching(true);
    api
      .get<{ average_load_price: number; base_currency: any }>(
        `/wallets/${walletId}/average-load-price`,
      )
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

export default useCurrencyData;
