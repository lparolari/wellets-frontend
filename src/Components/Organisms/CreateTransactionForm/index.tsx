import React, { useState, useCallback, useRef, useMemo } from 'react';
import { FormHandles } from '@unform/core';
import { Box, useToast } from '@chakra-ui/react';

import Form from 'Components/Atoms/Form';
import Input from 'Components/Atoms/Input';
import Radio from 'Components/Atoms/Radio';
import Button from 'Components/Atoms/Button';

import { useErrors } from 'Hooks/errors';

import ICreateTransactionDTO from 'DTOs/ICreateTransactionDTO';
import ICurrency from 'Entities/ICurrency';
import IWallet from 'Entities/IWallet';

import api from 'Services/api';
import createTransaction from 'Schemas/createTransaction';
import { getCurrencyName } from 'Helpers/getCurrency';

interface ICreateTransaction extends ICreateTransactionDTO {
  type?: 'incoming' | 'outcoming';
}

interface IProps {
  wallet: IWallet;
  currencies: ICurrency[];
  onSuccess?: () => void;
}

const CreateTransactionForm: React.FC<IProps> = ({
  wallet,
  currencies,
  onSuccess,
}) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState(false);

  const valuePlaceholder = useMemo(
    () => `Value (${getCurrencyName(currencies, wallet.currency_id)})`,
    [wallet, currencies],
  );

  const handleCreateTransaction = useCallback(
    async (data: ICreateTransaction) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        await createTransaction.validate(data, {
          abortEarly: false,
        });
        data.value = data.type === 'outcoming' ? data.value * -1 : data.value;
        delete data.type;
        data.wallet_id = wallet.id;

        await api.post('/transactions', data);

        formRef.current?.reset();
        toast({
          title: 'A new transaction has been successfully created!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        handleErrors('Error when creating a new transaction', err, formRef);
      } finally {
        setLoading(false);
      }
    },
    [formRef, onSuccess, wallet, toast, handleErrors],
  );

  return (
    <Box w="100%">
      <Form ref={formRef} onSubmit={handleCreateTransaction}>
        <Input name="value" type="number" placeholder={valuePlaceholder} />
        <Input name="description" type="text" placeholder="Description" />
        <Radio
          name="type"
          options={[
            { id: 'incoming', value: 'incoming', label: 'Incoming' },
            { id: 'outcoming', value: 'outcoming', label: 'Outcoming' },
          ]}
        />
        <Button isLoading={loading} type="submit" isPrimary>
          Create
        </Button>
      </Form>
    </Box>
  );
};

export default CreateTransactionForm;
