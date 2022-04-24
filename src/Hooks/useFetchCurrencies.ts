import ICurrency from 'Entities/ICurrency';
import { useCallback, useEffect, useState } from 'react';
import api from 'Services/api';

import { useErrors } from './errors';

type Context = {
  currencies?: ICurrency[];
  isFetching: boolean;
  fetchCurrencies: () => void;
  updateCurrency: (currency: ICurrency) => void;
};

const useFetchCurrencies = (): Context => {
  const { handleErrors } = useErrors();

  const [isFetching, setFetching] = useState(false);
  const [currencies, setCurrencies] = useState<ICurrency[] | undefined>();

  const fetchCurrencies = useCallback(() => {
    setFetching(true);
    api
      .get('/currencies')
      .then(response => setCurrencies(response.data))
      .catch(err => handleErrors('Error when fetching user settings', err))
      .finally(() => setFetching(false));
  }, [handleErrors]);

  const updateCurrency = (currency: ICurrency) =>
    setCurrencies(
      prev => prev && prev.map(c => (c.id === currency.id ? currency : c)),
    );

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return {
    currencies,
    isFetching,
    fetchCurrencies,
    updateCurrency,
  };
};

export default useFetchCurrencies;
