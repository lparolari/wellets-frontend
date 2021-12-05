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
import Input from 'Components/Atoms/Input';
import Select, { IOption } from 'Components/Atoms/Select';
import Button from 'Components/Atoms/Button';

import { useErrors } from 'Hooks/errors';

import ICurrency from 'Entities/ICurrency';
import ICreateWalletDTO from 'DTOs/ICreateWalletDTO';

import api from 'Services/api';
import createWallet from 'Schemas/createWallet';

interface IProps {
  onSuccess?: () => void;
}

const CreateWalletForm: React.FC<IProps> = ({ onSuccess }) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const formRef = useRef<FormHandles>(null);

  const [currencies, setCurrencies] = useState([] as ICurrency[]);
  const [loadingCreateWallet, setLoadingCreateWallet] = useState(false);
  const [loadingFetchCurrencies, setLoadingFetchCurrencies] = useState(false);

  const currenciesOptions = useMemo(
    () =>
      currencies.map(currency => {
        return {
          value: currency.id,
          label: `${currency.acronym} - ${currency.alias}`,
        } as IOption;
      }),
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

  const handleCreateWallet = useCallback(
    async (data: ICreateWalletDTO) => {
      try {
        setLoadingCreateWallet(true);
        formRef.current?.setErrors({});

        await createWallet.validate(data, {
          abortEarly: false,
        });

        await api.post('/wallets', data);

        formRef.current?.reset();
        toast({
          title: 'A new wallet has been successfully created!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        handleErrors('Error when creating a new wallet', err, formRef);
      } finally {
        setLoadingCreateWallet(false);
      }
    },
    [formRef, onSuccess, handleErrors, toast],
  );

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return (
    <Box w="100%">
      <Form ref={formRef} onSubmit={handleCreateWallet}>
        <Skeleton isLoaded={!loadingFetchCurrencies}>
          <Select
            name="currency_id"
            placeholder="Select a currency"
            options={currenciesOptions}
          />
        </Skeleton>
        <Input
          name="alias"
          type="text"
          placeholder="Give a cool nickname to your wallet"
        />
        <Input
          name="balance"
          type="number"
          placeholder="Type an optional initial balance"
        />
        <Button isLoading={loadingCreateWallet} type="submit" isPrimary>
          Create
        </Button>
      </Form>
    </Box>
  );
};

export default CreateWalletForm;
