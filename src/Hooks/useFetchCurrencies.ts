import ICurrency from 'Entities/ICurrency';
import { useCallback, useState } from 'react';
import api from 'Services/api';

import { useErrors } from './errors';

const useFetchCurrencies = () => {
  const { handleErrors } = useErrors();

  const [isFetching, setFetching] = useState(false);
  const [currencies, setCurrencies] = useState<ICurrency[] | undefined>();

  const fetchCurrencies = useCallback(async () => {
    setFetching(true);
    await api
      .get('/currencies')
      .then(response => setCurrencies(response.data))
      .catch(err => handleErrors('Error when fetching user settings', err))
      .finally(() => setFetching(false));
  }, [handleErrors]);

  const replaceCurrency = (currency: ICurrency) => {
    setCurrencies(
      currencies && currencies.map(c => (c.id === currency.id ? currency : c)),
    );
  };

  return {
    currencies,
    isFetching,
    fetchCurrencies,
    replaceCurrency,
  };
};

export default useFetchCurrencies;
