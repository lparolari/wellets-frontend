import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { FormHandles } from '@unform/core';
import { Box, useToast, Skeleton } from '@chakra-ui/react';

import Form from 'Components/Atoms/Form';
import Input from 'Components/Atoms/Input';
import Select, { IOption } from 'Components/Atoms/Select';
import Button from 'Components/Atoms/Button';

import { useErrors } from 'Hooks/errors';

import ICreateTransferDTO from 'DTOs/ICreateTransferDTO';
import IWallet from 'Entities/IWallet';
import ICurrency from 'Entities/ICurrency';

import api from 'Services/api';
import createTransfer from 'Schemas/createTransfer';
import { getCurrencyName } from 'Helpers/getCurrency';

interface IProps {
  wallet: IWallet;
  currencies: ICurrency[];
  onSuccess?: () => void;
}

const CreateTransferForm: React.FC<IProps> = ({
  wallet,
  currencies,
  onSuccess,
}) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const formRef = useRef<FormHandles>(null);

  const [loadingFetchWallets, setLoadingFetchWallets] = useState(false);
  const [loadingCreateTransfer, setLoadingCreateTransfer] = useState(false);
  const [wallets, setWallets] = useState([] as IWallet[]);
  const [targetWallet, setTargetWallet] = useState({} as IWallet);

  const walletsOptions = useMemo<IOption[]>(
    () =>
      wallets.map(w => ({
        value: w.id,
        label: w.alias,
      })),
    [wallets],
  );

  const valuePlaceholder = useMemo(
    () => `Value (${getCurrencyName(currencies, wallet.currency_id)})`,
    [wallet, currencies],
  );

  const staticFeePlaceholder = useMemo(() => {
    if (!targetWallet.currency_id && !wallets[0]) {
      return 'Optional static fee';
    }
    const id = targetWallet.currency_id || wallets[0].currency_id;
    return `Optional static fee (${getCurrencyName(currencies, id)})`;
  }, [targetWallet, currencies, wallets]);

  const percentualFeePlaceholder = useMemo(() => {
    if (!targetWallet.currency_id && !wallets[0]) {
      return 'Optional percentual fee';
    }
    const id = targetWallet.currency_id || wallets[0].currency_id;
    return `Optional percentual fee (${getCurrencyName(currencies, id)})`;
  }, [targetWallet, currencies, wallets]);

  const fetchWallets = useCallback(async () => {
    try {
      setLoadingFetchWallets(true);

      const newWallets = [] as IWallet[];
      const limit = 25;
      let page = 1;
      let total = -1;

      while (newWallets.length !== total) {
        const response = await api.get('/wallets', {
          params: {
            limit,
            page,
          },
        });
        newWallets.push(...response.data.wallets);
        total = response.data.total;
        page++;
      }

      setWallets(newWallets.filter(w => w.id !== wallet.id));
      setLoadingFetchWallets(false);
    } catch (err) {
      handleErrors('Error when fetching wallets', err);
    }
  }, [wallet, handleErrors]);

  const fetchTargetWallet = useCallback(async (id: string) => {
    try {
      const response = await api.get(`wallets/${id}`);
      setTargetWallet(response.data);
    } catch {}
  }, []);

  const handleCreateTransfer = useCallback(
    async (data: ICreateTransferDTO) => {
      try {
        setLoadingCreateTransfer(true);
        formRef.current?.setErrors({});

        if (!data.static_fee) delete data.static_fee;
        if (!data.percentual_fee) delete data.percentual_fee;
        await createTransfer.validate(data, {
          abortEarly: false,
        });
        data.from_wallet_id = wallet.id;

        await api.post('/transfers', data);

        formRef.current?.reset();
        toast({
          title: 'A new transfer has been successfully created!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        handleErrors('Error when creating a new transfer', err, formRef);
      } finally {
        setLoadingCreateTransfer(false);
      }
    },
    [formRef, onSuccess, wallet, handleErrors, toast],
  );

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return (
    <Box w="100%">
      <Form ref={formRef} onSubmit={handleCreateTransfer}>
        <Skeleton isLoaded={!loadingFetchWallets}>
          <Select
            label="Receiving wallet"
            name="to_wallet_id"
            options={walletsOptions}
            onChange={e => fetchTargetWallet(e.target.value)}
          />
        </Skeleton>
        <Input name="value" type="number" placeholder={valuePlaceholder} />
        <Input
          name="static_fee"
          type="number"
          placeholder={staticFeePlaceholder}
        />
        <Input
          name="percentual_fee"
          type="number"
          placeholder={percentualFeePlaceholder}
        />
        <Button isLoading={loadingCreateTransfer} type="submit" isPrimary>
          Create
        </Button>
      </Form>
    </Box>
  );
};

export default CreateTransferForm;
