import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { FormHandles } from '@unform/core';
import { Box, Skeleton, useToast } from '@chakra-ui/react';

import Form from 'Components/Atoms/Form';
import Select, { IOption } from 'Components/Atoms/Select';
import Button from 'Components/Atoms/Button';

import { useErrors } from 'Hooks/errors';

import ICurrency from 'Entities/ICurrency';
import IUserSettings from 'Entities/IUserSettings';
import IUserSettingsDTO from 'DTOs/IUserSettings';

import api from 'Services/api';
import createUserSettings from 'Schemas/createUserSettings';

interface IProps {
  onSuccess?: () => void;
}

const CreateWalletForm: React.FC<IProps> = ({ onSuccess }) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const formRef = useRef<FormHandles>(null);

  const [currencies, setCurrencies] = useState([] as ICurrency[]);
  const [userSettings, setUserSettings] = useState<IUserSettings | undefined>(
    undefined,
  );
  const [loadingFetchCurrencies, setLoadingFetchCurrencies] = useState(false);
  const [loadingFetchUserSettings, setLoadingFetchUserSettings] =
    useState(false);
  const [loadingUpdateUserSettings, setLoadingUpdateUserSettings] =
    useState(false);

  const currenciesOptions = useMemo(
    () =>
      currencies.map(
        currency =>
          ({
            value: currency.id,
            label: `${currency.acronym} - ${currency.alias}`,
          } as IOption),
      ),
    [currencies],
  );

  const fetchCurrencies = useCallback(async () => {
    try {
      setLoadingFetchCurrencies(true);
      const response = await api.get('/currencies');
      setCurrencies(response.data);
      setLoadingFetchCurrencies(false);
    } catch (err) {
      handleErrors('Error when fetching currencies', err);
    }
  }, [handleErrors]);

  const fetchUserSettings = useCallback(async () => {
    try {
      setLoadingFetchUserSettings(true);
      const response = await api.get('/users/settings');
      setUserSettings(response.data);
      setLoadingFetchUserSettings(false);
    } catch (err) {
      handleErrors('Error when fetching user settings', err);
    }
  }, [handleErrors]);

  const handleSaveSettings = useCallback(
    async (data: IUserSettingsDTO) => {
      try {
        setLoadingUpdateUserSettings(true);
        formRef.current?.setErrors({});

        await createUserSettings.validate(data, {
          abortEarly: false,
        });

        await api.put('/users/settings', data);

        toast({
          title: 'Settings successfully saved!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        handleErrors('Error while saving settings', err, formRef);
      } finally {
        setLoadingUpdateUserSettings(false);
      }
    },
    [formRef, onSuccess, handleErrors, toast],
  );

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  useEffect(() => {
    // please note that this useEffect needs to depend on `loadingFetchCurrencies` and
    // `loadingFetchUserSettings` because of `isLoaded` behaviour on `Skeleton`.
    if (
      currencies &&
      currencies.length &&
      userSettings &&
      userSettings.currency_id
    ) {
      formRef.current?.setData({ currency_id: userSettings?.currency_id });
    }
  }, [
    formRef,
    userSettings,
    currencies,
    loadingFetchCurrencies,
    loadingFetchUserSettings,
  ]);

  return (
    <Box w="100%">
      <Form ref={formRef} onSubmit={handleSaveSettings}>
        <Skeleton
          isLoaded={!(loadingFetchCurrencies || loadingFetchUserSettings)}
        >
          <Select
            name="currency_id"
            placeholder="Currency"
            helper="Your currency is used to display your balance and transactions throughout the app."
            options={currenciesOptions}
          />
        </Skeleton>
        <Button isLoading={loadingUpdateUserSettings} type="submit" isPrimary>
          Save
        </Button>
      </Form>
    </Box>
  );
};

export default CreateWalletForm;
