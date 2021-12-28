import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { FormHandles } from '@unform/core';
import { Box, Skeleton, Stack, useToast } from '@chakra-ui/react';

import Form from 'Components/Atoms/Form';
import Input from 'Components/Atoms/Input';
import Button from 'Components/Atoms/Button';

import { useErrors } from 'Hooks/errors';

import IPocket from 'Entities/IPocket';
import IUpsertPocketDTO from 'DTOs/IUpsertPocketDTO';
import IFormPocketDTO from 'DTOs/IFormPocketDTO';

import api from 'Services/api';
import upsertPocket from 'Schemas/upsertPocket';
import IWallet from 'Entities/IWallet';
import { IOption } from 'Components/Atoms/Select';
import Select from 'Components/Atoms/BetterSelect';

interface IProps {
  currentPocket: IPocket;
  onSuccess?: () => void;
  onCancelUpdate?: () => void;
}

const UpsertPocketForm: React.FC<IProps> = ({
  onSuccess,
  currentPocket,
  onCancelUpdate,
}) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const formRef = useRef<FormHandles>(null);

  const [wallets, setWallets] = useState([] as IWallet[]);
  const [pockets, setPockets] = useState([] as IPocket[]);

  const [loadingUpsertPocket, setLoadingUpsertPocket] = useState(false);
  const [loadingFetchWallets, setLoadingFetchWallets] = useState(false);
  const [loadingFetchPockets, setLoadingFetchPockets] = useState(false);

  const pocketToOption = (pocket: IPocket) => {
    return {
      value: pocket.id,
      label: `${pocket.alias} ${!pocket.parent ? '(root)' : ''}`,
    } as IOption;
  };

  const walletToOption = (wallet: IWallet) => {
    return {
      value: wallet.id,
      label: `${wallet.alias}`,
    } as IOption;
  };

  const pocketsOptions = useMemo(() => pockets.map(pocketToOption), [pockets]);
  const walletsOptions = useMemo(() => wallets.map(walletToOption), [wallets]);

  const fetchWallets = useCallback(async () => {
    try {
      setLoadingFetchWallets(true);
      const response = await api.get('/wallets', {
        params: {
          page: 1,
          limit: 25,
        },
      });
      setWallets(response.data.wallets);
      setLoadingFetchWallets(false);
    } catch (err) {
      handleErrors('Error when fetching wallets', err);
    }
  }, [handleErrors]);

  const fetchPockets = useCallback(async () => {
    try {
      setLoadingFetchPockets(true);
      const response = await api.get('/pockets');
      setPockets(response.data);
      setLoadingFetchPockets(false);
    } catch (err) {
      handleErrors('Error when fetching pockets', err);
    }
  }, [handleErrors]);

  const handleUpsertPocket = useCallback(
    async (formData: IFormPocketDTO) => {
      const isUpdate = !!currentPocket.id;

      const data: IUpsertPocketDTO = {
        alias: formData.alias,
        weight: formData.weight,
        parent_id: formData.parent ? `${formData.parent?.value}` : undefined,
        wallet_ids: formData.wallets
          ? formData.wallets?.map((wallet: IOption) => `${wallet.value}`)
          : [],
      };

      try {
        setLoadingUpsertPocket(true);
        formRef.current?.setErrors({});

        await upsertPocket.validate(data, {
          abortEarly: false,
        });

        if (isUpdate) {
          await api.put(`/pockets/${currentPocket.id}`, data);
        } else {
          await api.post('/pockets', data);
        }

        toast({
          title: isUpdate
            ? 'Your pocket was successfully updated!'
            : 'A new pocket has been successfully created!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        handleErrors(
          isUpdate
            ? 'Error when updating your currency'
            : 'Error when creating a new currency',
          err,
          formRef,
        );
      } finally {
        setLoadingUpsertPocket(false);
      }
    },
    [formRef, onSuccess, handleErrors, toast, currentPocket],
  );

  useEffect(() => {
    if (currentPocket.id) {
      formRef.current?.setData({
        id: currentPocket.id,
        alias: currentPocket.alias,
        weight: currentPocket.weight * 100,
        parent: currentPocket.parent
          ? pocketToOption(currentPocket.parent)
          : undefined,
        wallets: currentPocket.wallets.map(wallet => ({
          value: wallet.id,
          label: wallet.alias,
        })),
      });
      return;
    }
    formRef.current?.reset();
  }, [currentPocket]);

  useEffect(() => {
    fetchPockets();
  }, [fetchPockets]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return (
    <Box w="100%">
      <Form ref={formRef} onSubmit={handleUpsertPocket}>
        <Input name="alias" type="text" placeholder="Alias" />
        <Input
          name="weight"
          type="number"
          placeholder="Weight"
          helper="The pocket allocation in percentage"
        />
        <Skeleton isLoaded={!loadingFetchWallets}>
          <Select
            isMulti
            name="wallets"
            placeholder="Select one or more wallets"
            options={walletsOptions}
            helper="Wallets belonging to the pocket"
          />
        </Skeleton>
        <Skeleton isLoaded={!loadingFetchPockets}>
          <Select
            name="parent"
            placeholder="Select a pocket"
            options={pocketsOptions}
            helper="Parent pocket - do not set for root pockets"
          />
        </Skeleton>
        <Stack spacing="10px">
          <Button
            isLoading={loadingUpsertPocket}
            type="submit"
            colorSchema="blue"
            isPrimary
          >
            {currentPocket.id ? 'Update' : 'Create'}
          </Button>
          {currentPocket.id && (
            <Button type="button" onClick={onCancelUpdate} isDanger>
              Cancel
            </Button>
          )}
        </Stack>
      </Form>
    </Box>
  );
};

export default UpsertPocketForm;
