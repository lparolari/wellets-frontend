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

import api from 'Services/api';
import createTransfer from 'Schemas/createTransfer';
import IWallet from 'Entities/IWallet';

interface IProps {
  walletId: string;
  onSuccess?: () => void;
}

const CreateTransferForm: React.FC<IProps> = ({ walletId, onSuccess }) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const formRef = useRef<FormHandles>(null);

  const [loadingFetchWallets, setLoadingFetchWallets] = useState(false);
  const [loadingCreateTransfer, setLoadingCreateTransfer] = useState(false);
  const [wallets, setWallets] = useState([] as IWallet[]);

  const walletsOptions = useMemo<IOption[]>(
    () =>
      wallets.map(wallet => ({
        value: wallet.id,
        label: wallet.alias,
      })),
    [wallets],
  );

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

      setWallets(newWallets.filter(wallet => wallet.id !== walletId));
      setLoadingFetchWallets(false);
    } catch (err) {
      handleErrors('Error when fetching wallets', err);
    }
  }, [walletId, handleErrors]);

  const handleCreateTransfer = useCallback(
    async (data: ICreateTransferDTO) => {
      try {
        setLoadingCreateTransfer(true);
        formRef.current?.setErrors({});

        if (!data.static_rate) delete data.static_rate;
        if (!data.percentual_rate) delete data.percentual_rate;
        await createTransfer.validate(data, {
          abortEarly: false,
        });
        data.from_wallet_id = walletId;

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
    [formRef, onSuccess, walletId, handleErrors, toast],
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
          />
        </Skeleton>
        <Input name="value" type="number" placeholder="Value" />
        <Input
          name="static_rate"
          type="number"
          placeholder="Static fee (optional)"
        />
        <Input
          name="percentual_rate"
          type="number"
          placeholder="Percentual fee (optional)"
        />
        <Button isLoading={loadingCreateTransfer} type="submit" isPrimary>
          Create
        </Button>
      </Form>
    </Box>
  );
};

export default CreateTransferForm;
