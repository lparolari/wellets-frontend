import { Box, InputRightElement, Stack, useToast } from '@chakra-ui/react';
import Button from 'Components/Atoms/Button';
import DateTimeInput from 'Components/Atoms/DateTimeInput';
import Form from 'Components/Atoms/Form2';
import Input from 'Components/Atoms/Input2';
import Radio from 'Components/Atoms/Radio2';
import BalanceBadge from 'Components/Molecules/Balance/BalanceBadge';
import ChangeRateField from 'Components/Molecules/ChangeRateField';
import IUpdateTransactionDTO from 'DTOs/IUpdateTransactionDTO';
import ICurrency from 'Entities/ICurrency';
import ITransaction from 'Entities/ITransaction';
import IWallet from 'Entities/IWallet';
import { Formik } from 'formik';
import { getCurrencyName } from 'Helpers/getCurrency';
import { useErrors } from 'Hooks/errors';
import React, { useCallback, useMemo } from 'react';
import createTransaction from 'Schemas/createTransaction';
import api from 'Services/api';

interface IUpdateTransaction {
  value: number;
  description: string;
  type: 'incoming' | 'outcoming';
  change_rate?: number;
  created_at?: Date;
}

interface IFormValues {
  value: string;
  description: string;
  change_rate: string;
  type: string;
  created_at: string;
}

interface IProps {
  wallet: IWallet;
  currencies: ICurrency[];
  targetCurrency: ICurrency;
  baseCurrency: ICurrency;
  transaction: ITransaction;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UpdateTransactionForm: React.FC<IProps> = ({
  wallet,
  currencies,
  targetCurrency,
  baseCurrency,
  transaction,
  onSuccess,
  onCancel,
}) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const valuePlaceholder = useMemo(
    () => `Value (${getCurrencyName(currencies, wallet.currency_id)})`,
    [wallet, currencies],
  );

  const handleUpdateTransaction = useCallback(
    async (data: IUpdateTransaction) => {
      try {
        const value = data.type === 'outcoming' ? data.value * -1 : data.value;
        const dollar_rate = data.change_rate;
        const { description, created_at } = data;

        await api.put(`/transactions/${transaction.id}`, {
          value,
          dollar_rate,
          description,
          created_at,
        } as IUpdateTransactionDTO);

        toast({
          title: 'The transaction has been successfully updated!',
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
    [transaction.id, toast, onSuccess, handleErrors],
  );

  return baseCurrency && targetCurrency ? (
    <Box w="100%">
      <Formik<IFormValues>
        initialValues={{
          value: Math.abs(transaction.value).toString(),
          description: transaction.description,
          change_rate: transaction.dollar_rate.toString(),
          type: transaction
            ? transaction.value < 0
              ? 'outcoming'
              : 'incoming'
            : '',
          created_at: new Date(transaction.created_at)
            .toISOString()
            .slice(0, 19),
        }}
        enableReinitialize
        validationSchema={createTransaction}
        onSubmit={(values, { setSubmitting }) => {
          if (
            values.value !== '' &&
            values.description !== '' &&
            values.type !== ''
          ) {
            handleUpdateTransaction({
              value: Number(values.value),
              description: values.description,
              type: values.type as 'incoming' | 'outcoming',
              change_rate: values.change_rate
                ? Number(values.change_rate)
                : undefined,
              created_at: values.created_at
                ? new Date(values.created_at)
                : undefined,
            })
              .then(() => onCancel && onCancel())
              .finally(() => setSubmitting(false));
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <Stack direction="row">
              <Input
                name="value"
                type="number"
                placeholder={valuePlaceholder}
                rightElement={
                  values.value && (
                    <InputRightElement width="6.5rem">
                      <BalanceBadge
                        balance={Number(values.value)}
                        currency={baseCurrency.acronym}
                        dollar_rate={
                          values.change_rate
                            ? Number(values.change_rate) /
                              baseCurrency.dollar_rate
                            : targetCurrency.dollar_rate /
                              baseCurrency.dollar_rate
                        }
                      />
                    </InputRightElement>
                  )
                }
              />

              <ChangeRateField
                name="change_rate"
                targetCurrency={targetCurrency}
                baseCurrency={baseCurrency}
              />
            </Stack>

            <Input name="description" type="text" placeholder="Description" />

            <Radio
              name="type"
              options={[
                { id: 'incoming', value: 'incoming', label: 'Incoming' },
                { id: 'outcoming', value: 'outcoming', label: 'Outcoming' },
              ]}
            />

            <DateTimeInput
              name="created_at"
              helper="The date and time of the transaction"
            />

            <Stack spacing="10px">
              <Button
                type="submit"
                isPrimary
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                colorSchema="blue"
              >
                Update
              </Button>
              <Button
                type="button"
                isDisabled={isSubmitting}
                isDanger
                onClick={() => onCancel && onCancel()}
              >
                Cancel
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  ) : null;
};

export default UpdateTransactionForm;
