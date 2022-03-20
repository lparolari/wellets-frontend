import ICurrency from 'Entities/ICurrency';
import { useEffect, useState } from 'react';
import api from 'Services/api';

import { useErrors } from './errors';

type Context = {
  currencies?: ICurrency[];
  isLoading: boolean;
};

const useCurrencyData = (): Context => {
  const { handleErrors } = useErrors();

  const [isLoading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState<ICurrency[] | undefined>();

  useEffect(() => {
    setLoading(true);
    api
      .get('/currencies')
      .then(response => setCurrencies(response.data))
      .catch(err => handleErrors('Error when fetching user settings', err))
      .finally(() => setLoading(false));
  }, [handleErrors]);

  return {
    currencies,
    isLoading,
  };
};

export default useCurrencyData;
