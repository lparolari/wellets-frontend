import ICurrency from 'Entities/ICurrency';
import { useCallback, useState } from 'react';
import api from 'Services/api';

import { useErrors } from './errors';

type UpdateCurrencyHandler = (params: {
  id: string;
  currency: { favorite: boolean };
  onUpdated?: (currency: ICurrency) => void;
}) => void;

const useUpdateCurrency = () => {
  const { handleErrors } = useErrors();

  const [isUpdating, setUpdating] = useState(false);

  const updateCurrency: UpdateCurrencyHandler = useCallback(
    ({ id, currency, onUpdated }) => {
      setUpdating(true);
      api
        .put<ICurrency>(`/currencies/${id}`, currency)
        .then(data => onUpdated && onUpdated(data.data))
        .catch(err => handleErrors('Error when fetching user settings', err))
        .finally(() => setUpdating(false));
    },
    [handleErrors],
  );

  return { isUpdating, updateCurrency };
};

export default useUpdateCurrency;
