import ICurrency from 'Entities/ICurrency';

import useUserSettingsData from './useUserSettingsData';

type Context = {
  baseCurrency?: ICurrency;
  isLoading: boolean;
};

const useBaseCurrencyData = (): Context => {
  const { userSettings, isLoading } = useUserSettingsData();

  return {
    baseCurrency: userSettings ? userSettings.currency : undefined,
    isLoading,
  };
};

export default useBaseCurrencyData;
