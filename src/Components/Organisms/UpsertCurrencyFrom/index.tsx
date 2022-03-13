import { Box, Stack, useToast } from '@chakra-ui/react';
import { FormHandles } from '@unform/core';
import Button from 'Components/Atoms/Button';
import Form from 'Components/Atoms/Form';
import Input from 'Components/Atoms/Input';
import Radio from 'Components/Atoms/Radio';
import IUpsertCurrencyDTO from 'DTOs/IUpsertCurrencyDTO';
import ICurrency from 'Entities/ICurrency';
import { useErrors } from 'Hooks/errors';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import upsertCurrency from 'Schemas/upsertCurrency';
import api from 'Services/api';

interface IProps {
  currentCurrency: ICurrency;
  onSuccess?: () => void;
  onCancelUpdate?: () => void;
}

const UpsertCurrencyForm: React.FC<IProps> = ({
  onSuccess,
  currentCurrency,
  onCancelUpdate,
}) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const formRef = useRef<FormHandles>(null);

  const [loadingUpsertCurrency, setLoadingUpsertCurrency] = useState(false);

  const handleUpsertCurrency = useCallback(
    async (data: IUpsertCurrencyDTO) => {
      const preprocess = (x: IUpsertCurrencyDTO) => ({
        ...x,
        favorite: x.favorite === 'true',
      });
      const isUpdate = !!currentCurrency.id;

      try {
        setLoadingUpsertCurrency(true);
        formRef.current?.setErrors({});

        await upsertCurrency.validate(data, {
          abortEarly: false,
        });

        data.dollar_rate = 1 / data.dollar_rate;

        if (isUpdate) {
          await api.put(
            `/currencies/custom/${currentCurrency.id}`,
            preprocess(data),
          );
        } else {
          await api.post('/currencies/custom', preprocess(data));
        }

        toast({
          title: isUpdate
            ? 'Your currency was successfully updated!'
            : 'A new currency has been successfully created!',
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
        setLoadingUpsertCurrency(false);
      }
    },
    [formRef, onSuccess, handleErrors, toast, currentCurrency],
  );

  useEffect(() => {
    if (currentCurrency.id) {
      formRef.current?.setData({
        ...currentCurrency,
        favorite: currentCurrency.favorite ? 'true' : 'false',
      });
      return;
    }
    formRef.current?.reset();
  }, [currentCurrency]);

  return (
    <Box w="100%">
      <Form ref={formRef} onSubmit={handleUpsertCurrency}>
        <Input name="acronym" type="text" placeholder="3 or 4 letter acronym" />
        <Input name="alias" type="text" placeholder="Alias" />
        <Input
          name="dollar_rate"
          type="number"
          placeholder="Dollar rate"
          helper="1 unity of your currency equals ? USD"
        />
        <Input
          name="format"
          type="text"
          placeholder="Display format (like $ 00.00)"
        />
        <Radio
          name="favorite"
          options={[
            { id: 'true', value: 'true', label: 'Is favorite' },
            { id: 'false', value: 'false', label: 'Is not favorite' },
          ]}
        />
        <Stack spacing="10px">
          <Button
            isLoading={loadingUpsertCurrency}
            type="submit"
            colorSchema="blue"
            isPrimary
          >
            {currentCurrency.id ? 'Update' : 'Create'}
          </Button>
          {currentCurrency.id && (
            <Button type="button" onClick={onCancelUpdate} isDanger>
              Cancel
            </Button>
          )}
        </Stack>
      </Form>
    </Box>
  );
};

export default UpsertCurrencyForm;
