import { Box, useToast } from '@chakra-ui/react';
import Button from 'Components/Atoms/Button';
import Form from 'Components/Atoms/Form2';
import Input from 'Components/Atoms/Input2';
import Radio from 'Components/Atoms/Radio2';
import ICreateTransactionDTO from 'DTOs/ICreateTransactionDTO';
import ICurrency from 'Entities/ICurrency';
import IWallet from 'Entities/IWallet';
import { Formik } from 'formik';
import { getCurrencyName } from 'Helpers/getCurrency';
import { useErrors } from 'Hooks/errors';
import React, { useCallback, useMemo } from 'react';
import createTransaction from 'Schemas/createTransaction';
import api from 'Services/api';

import BaseRate from './BaseRate';

interface ICreateTransaction {
  value: number;
  description: string;
  type: 'incoming' | 'outcoming';
  base_rate?: number;
}

interface IFormValues {
  value: string;
  description: string;
  base_rate: string;
  type: string;
}

interface IProps {
  wallet: IWallet;
  currencies: ICurrency[];
  targetCurrency: ICurrency;
  baseCurrency: ICurrency;
  onSuccess?: () => void;
}

const CreateTransactionForm: React.FC<IProps> = ({
  wallet,
  currencies,
  targetCurrency,
  baseCurrency,
  onSuccess,
}) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const valuePlaceholder = useMemo(
    () => `Value (${getCurrencyName(currencies, wallet.currency_id)})`,
    [wallet, currencies],
  );

  const handleCreateTransaction = useCallback(
    async (data: ICreateTransaction) => {
      try {
        const value = data.type === 'outcoming' ? data.value * -1 : data.value;
        const wallet_id = wallet.id;
        const dollar_rate = data.base_rate
          ? 1 / (data.base_rate / baseCurrency.dollar_rate)
          : undefined;
        const { description } = data;

        await api.post('/transactions', {
          value,
          wallet_id,
          dollar_rate,
          description,
        } as ICreateTransactionDTO);

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
        handleErrors('Error when creating a new transaction', err);
      }
    },
    [wallet.id, baseCurrency.dollar_rate, toast, onSuccess, handleErrors],
  );

  return baseCurrency && targetCurrency ? (
    <Box w="100%">
      <Formik<IFormValues>
        initialValues={{ value: '', description: '', base_rate: '', type: '' }}
        validationSchema={createTransaction}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (
            values.value !== '' &&
            values.description !== '' &&
            values.type !== ''
          ) {
            handleCreateTransaction({
              value: Number(values.value),
              description: values.description,
              type: values.type as 'incoming' | 'outcoming',
              base_rate: Number(values.base_rate),
            })
              .then(() => resetForm())
              .finally(() => setSubmitting(false));
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Input name="value" type="number" placeholder={valuePlaceholder} />
            <Input name="description" type="text" placeholder="Description" />
            <Radio
              name="type"
              options={[
                { id: 'incoming', value: 'incoming', label: 'Incoming' },
                { id: 'outcoming', value: 'outcoming', label: 'Outcoming' },
              ]}
            />
            <BaseRate
              name="base_rate"
              targetCurrency={targetCurrency}
              baseCurrency={baseCurrency}
            />
            <Button
              type="submit"
              isPrimary
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  ) : null;
};

export default CreateTransactionForm;
