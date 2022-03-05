import { useToast } from '@chakra-ui/react';
import { useErrors } from 'Hooks/errors';
import { useCallback, useState } from 'react';

import api from 'Services/api';

export const useSyncCurrencies = () => {
  const { handleErrors } = useErrors();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const sync = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.post(`/currencies/rate/sync`);

      if (response.status === 200)
        toast({
          title: 'Currencies synced less than a minute ago',
          status: 'info',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      if (response.status === 201)
        toast({
          title: 'Currencies synced successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    } catch (err) {
      handleErrors('Error when fetching portfolios', err);
    } finally {
      setIsLoading(false);
    }
  }, [handleErrors, toast]);

  return {
    sync,
    isLoading,
  };
};
