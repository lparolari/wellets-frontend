import { Box, Skeleton, Stack, useToast } from '@chakra-ui/react';
import { FormHandles } from '@unform/core';
import Select from 'Components/Atoms/BetterSelect';
import Button from 'Components/Atoms/Button';
import Form from 'Components/Atoms/Form';
import Input from 'Components/Atoms/Input';
import { IOption } from 'Components/Atoms/Select';
import IFormPortfolioDTO from 'DTOs/IFormPortfolioDTO';
import IUpsertPortfolioDTO from 'DTOs/IUpsertPortfolioDTO';
import IPortfolio from 'Entities/IPortfolio';
import IWallet from 'Entities/IWallet';
import { useErrors } from 'Hooks/errors';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import upsertPortfolio from 'Schemas/upsertPortfolio';
import api from 'Services/api';

interface IProps {
  currentPortfolio: IPortfolio;
  defaultParentPortfolio?: IPortfolio;
  onSuccess?: () => void;
  onCancelUpdate?: () => void;
}

const UpsertPortfolioForm: React.FC<IProps> = ({
  onSuccess,
  currentPortfolio,
  defaultParentPortfolio,
  onCancelUpdate,
}) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const formRef = useRef<FormHandles>(null);

  const [wallets, setWallets] = useState([] as IWallet[]);
  const [portfolios, setPortfolios] = useState([] as IPortfolio[]);

  const [loadingUpsertPortfolio, setLoadingUpsertPortfolio] = useState(false);
  const [loadingFetchWallets, setLoadingFetchWallets] = useState(false);
  const [loadingFetchPortfolios, setLoadingFetchPortfolios] = useState(false);

  const portfolioToOption = (portfolio: IPortfolio) =>
    ({
      value: portfolio.id,
      label: `${portfolio.alias} ${
        !portfolio.parent ? '(root)' : `(${portfolio.parent.alias})`
      }`,
    } as IOption);

  const walletToOption = (wallet: IWallet) =>
    ({
      value: wallet.id,
      label: `${wallet.alias}`,
    } as IOption);

  const portfoliosOptions = useMemo(
    () => portfolios.map(portfolioToOption),
    [portfolios],
  );
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

  const fetchPortfolios = useCallback(async () => {
    try {
      setLoadingFetchPortfolios(true);
      const response = await api.get('/portfolios/all');
      setPortfolios(response.data);
      setLoadingFetchPortfolios(false);
    } catch (err) {
      handleErrors('Error when fetching portfolios', err);
    }
  }, [handleErrors]);

  const handleUpsertPortfolio = useCallback(
    async (formData: IFormPortfolioDTO) => {
      const isUpdate = !!currentPortfolio.id;

      const data: IUpsertPortfolioDTO = {
        alias: formData.alias,
        weight: formData.weight / 100,
        parent_id: formData.parent ? `${formData.parent?.value}` : undefined,
        wallet_ids: formData.wallets
          ? formData.wallets?.map((wallet: IOption) => `${wallet.value}`)
          : [],
      };

      try {
        setLoadingUpsertPortfolio(true);
        formRef.current?.setErrors({});

        await upsertPortfolio.validate(data, {
          abortEarly: false,
        });

        if (isUpdate) {
          await api.put(`/portfolios/${currentPortfolio.id}`, data);
        } else {
          await api.post('/portfolios', data);
        }

        toast({
          title: isUpdate
            ? 'Your portfolio was successfully updated!'
            : 'A new portfolio has been successfully created!',
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
            ? 'Error when updating your portfolio'
            : 'Error when creating a new portfolio',
          err,
          formRef,
        );
      } finally {
        setLoadingUpsertPortfolio(false);
      }
    },
    [formRef, onSuccess, handleErrors, toast, currentPortfolio],
  );

  useEffect(() => {
    if (currentPortfolio.id) {
      formRef.current?.setData({
        id: currentPortfolio.id,
        alias: currentPortfolio.alias,
        weight: currentPortfolio.weight * 100,
        parent: currentPortfolio.parent
          ? portfolioToOption(currentPortfolio.parent)
          : null,
        wallets: currentPortfolio.wallets.map(wallet => ({
          value: wallet.id,
          label: wallet.alias,
        })),
      });
      return;
    }
    formRef.current?.reset();
  }, [currentPortfolio]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return (
    <Box w="100%">
      <Form ref={formRef} onSubmit={handleUpsertPortfolio}>
        <Input name="alias" type="text" placeholder="Alias" />
        <Input
          name="weight"
          type="number"
          placeholder="Weight"
          helper="The portfolio allocation in percentage"
        />
        <Skeleton isLoaded={!loadingFetchWallets}>
          <Select
            isMulti
            name="wallets"
            placeholder="Select one or more wallets"
            options={walletsOptions}
            helper="Wallets belonging to the portfolio"
          />
        </Skeleton>
        <Skeleton isLoaded={!loadingFetchPortfolios}>
          <Stack direction="row">
            <Select
              name="parent"
              placeholder="Select a portfolio"
              options={portfoliosOptions}
              helper="Parent portfolio - do not set for root portfolios"
            />
            {defaultParentPortfolio && defaultParentPortfolio.id && (
              <Button
                variant="ghost"
                onClick={() =>
                  formRef.current?.setFieldValue(
                    'parent',
                    portfolioToOption(defaultParentPortfolio),
                  )
                }
              >
                Set {defaultParentPortfolio.alias}
              </Button>
            )}
          </Stack>
        </Skeleton>
        <Stack spacing="10px">
          <Button
            isLoading={loadingUpsertPortfolio}
            type="submit"
            colorSchema="blue"
            isPrimary
          >
            {currentPortfolio.id ? 'Update' : 'Create'}
          </Button>
          {currentPortfolio.id && (
            <Button type="button" onClick={onCancelUpdate} isDanger>
              Cancel
            </Button>
          )}
        </Stack>
      </Form>
    </Box>
  );
};

export default UpsertPortfolioForm;
