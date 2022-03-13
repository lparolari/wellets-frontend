import Button from 'Components/Atoms/Button';
import React from 'react';

import { useSyncCurrencies } from './useSyncCurrencies';

export const SyncCurrenciesButton = () => {
  const { sync, isLoading } = useSyncCurrencies();
  return (
    <Button
      variant="ghost"
      size="sm"
      mr={4}
      onClick={sync}
      disabled={isLoading}
      isLoading={isLoading}
    >
      Sync currencies
    </Button>
  );
};
