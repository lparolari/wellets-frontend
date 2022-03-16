import IUserSettings from 'Entities/IUserSettings';
import { useEffect, useState } from 'react';
import api from 'Services/api';

import { useErrors } from './errors';

type Context = {
  userSettings?: IUserSettings;
  isLoading: boolean;
};

const useUserSettingsData = (): Context => {
  const { handleErrors } = useErrors();

  const [isLoading, setLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<IUserSettings | undefined>();

  useEffect(() => {
    setLoading(true);
    api
      .get('/users/settings')
      .then(response => setUserSettings(response.data))
      .catch(err => handleErrors('Error when fetching user settings', err))
      .finally(() => setLoading(false));
  }, [handleErrors]);

  return {
    userSettings,
    isLoading,
  };
};

export default useUserSettingsData;
