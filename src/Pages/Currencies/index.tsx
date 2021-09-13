import React, { useEffect, useState, useCallback } from 'react';
import {
  useToast,
  Flex,
  Stack,
  Heading,
  useBreakpointValue,
  StackDirection,
  Skeleton,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

import Button from 'Components/Atoms/Button';
import PageContainer from 'Components/Atoms/PageContainer';
import ContentContainer from 'Components/Atoms/ContentContainer';
import Table from 'Components/Molecules/Table';
import UpsertCurrencyForm from 'Components/Organisms/UpsertCurrencyFrom';
import Header from 'Components/Organisms/Header';

import { useErrors } from 'Hooks/errors';

import ICurrency from 'Entities/ICurrency';

import api from 'Services/api';

const Currencies: React.FC = () => {
  const { handleErrors } = useErrors();

  const toast = useToast();
  const stack = useBreakpointValue({
    base: {
      direction: 'column' as StackDirection,
    },
    lg: {
      direction: 'row' as StackDirection,
    },
  });

  const [currencies, setCurrencies] = useState([] as ICurrency[]);
  const [loadingDeleteCurrency, setLoadingDeleteCurrency] = useState(false);
  const [loadingFetchCurrencies, setLoadingFetchCurrencies] = useState(false);
  const [
    loadingMarkAsFavoriteCurrency,
    setLoadingMarkAsFavoriteCurrency,
  ] = useState(-1);
  const [currentCurrency, setCurrentCurrency] = useState({} as ICurrency);
  const [loadingFetchAllCurrencies, setLoadingFetchAllCurrencies] = useState(
    false,
  );
  const [allCurrencies, setAllCurrencies] = useState([] as ICurrency[]);

  const fetchAllCurrencies = useCallback(
    async (loadingEnabled = true) => {
      try {
        if (loadingEnabled) setLoadingFetchAllCurrencies(true);
        const response = await api.get('/currencies?sort_by=acronym');
        setAllCurrencies(response.data);
      } catch (err) {
        handleErrors('Error when fetching all currencies', err);
      } finally {
        if (loadingEnabled) setLoadingFetchAllCurrencies(false);
      }
    },
    [handleErrors],
  );

  const fetchCurrencies = useCallback(
    async (loadingEnabled = true) => {
      try {
        if (loadingEnabled) setLoadingFetchCurrencies(true);
        const response = await api.get('/currencies/custom');
        setCurrencies(response.data);
      } catch (err) {
        handleErrors('Error when fetching currencies', err);
      } finally {
        if (loadingEnabled) setLoadingFetchCurrencies(false);
      }
    },
    [handleErrors],
  );

  const handleDeleteCurrency = useCallback(
    async (id: string) => {
      try {
        setLoadingDeleteCurrency(true);
        await api.delete(`/currencies/custom/${id}`);
        toast({
          title: 'Currency deleted',
          description: 'Your currency was successfully deleted',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchCurrencies();
      } catch (err) {
        handleErrors('Error when deleting currency', err);
      } finally {
        setLoadingDeleteCurrency(false);
      }
    },
    [toast, handleErrors, fetchCurrencies],
  );

  const handleToggleFavoriteCurrency = useCallback(
    async (index: number, id: string, favorite: boolean) => {
      try {
        setLoadingMarkAsFavoriteCurrency(index);
        await api.put(`/currencies/${id}`, { favorite });
        fetchAllCurrencies(false);
      } catch (err) {
        handleErrors('Error when toggling favorite currency', err);
      } finally {
        setLoadingMarkAsFavoriteCurrency(-1);
      }
    },
    [handleErrors, fetchAllCurrencies],
  );

  useEffect(() => {
    fetchCurrencies();
    fetchAllCurrencies();
  }, [fetchCurrencies, fetchAllCurrencies]);

  return (
    <PageContainer>
      <Header color="blue" />

      <ContentContainer flexDirection="column" justifyContent="start">
        <Heading>Custom Currencies</Heading>

        <Stack mt="50px" w="100%" direction={stack?.direction} spacing="25px">
          <Skeleton isLoaded={!loadingFetchCurrencies}>
            <Table
              rows={currencies}
              columns={[
                {
                  title: 'Acronym',
                  key: 'acronym',
                  dataIndex: 'acronym',
                },
                {
                  title: 'Alias',
                  key: 'alias',
                  dataIndex: 'alias',
                },
                {
                  title: 'Dollar rate',
                  key: 'dollar_rate',
                  render(currency: ICurrency) {
                    return `USD ${currency.dollar_rate}`;
                  },
                },
                {
                  title: 'Format',
                  key: 'format',
                  dataIndex: 'format',
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render(currency: ICurrency) {
                    return (
                      <Flex>
                        <Button
                          type="button"
                          onClick={() =>
                            setCurrentCurrency({
                              ...currency,
                              dollar_rate: 1 / currency.dollar_rate,
                            })
                          }
                          mr="10px"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          isLoading={loadingDeleteCurrency}
                          onClick={() => handleDeleteCurrency(currency.id)}
                          confirmation={{
                            body:
                              'Are you sure you want to delete this currency? All data attached to it will be lost.',
                            buttonText: 'I am sure',
                            colorSchema: 'red',
                          }}
                        >
                          Delete
                        </Button>
                      </Flex>
                    );
                  },
                },
              ]}
            />
          </Skeleton>

          <UpsertCurrencyForm
            onSuccess={() => {
              setCurrentCurrency({} as ICurrency);
              fetchCurrencies(false);
              fetchAllCurrencies(false);
            }}
            currentCurrency={currentCurrency}
            onCancelUpdate={() => setCurrentCurrency({} as ICurrency)}
          />
        </Stack>
      </ContentContainer>

      <ContentContainer flexDirection="column" justifyContent="start">
        <Heading>All Currencies</Heading>

        <Skeleton isLoaded={!loadingFetchAllCurrencies}>
          <Table
            rows={allCurrencies}
            columns={[
              {
                title: 'Acronym',
                key: 'acronym',
                dataIndex: 'acronym',
              },
              {
                title: 'Alias',
                key: 'alias',
                dataIndex: 'alias',
              },
              {
                title: 'Dollar rate',
                key: 'dollar_rate',
                render(currency: ICurrency) {
                  return `USD ${currency.dollar_rate}`;
                },
              },
              {
                title: 'Format',
                key: 'format',
                dataIndex: 'format',
              },
              {
                title: 'Actions',
                key: 'actions',
                render(currency: ICurrency, index: number) {
                  return (
                    <IconButton
                      size="md"
                      icon={
                        currency.favorite ? (
                          <Icon as={MdFavorite} />
                        ) : (
                          <Icon as={MdFavoriteBorder} />
                        )
                      }
                      aria-label="Mark as favorite"
                      isLoading={loadingMarkAsFavoriteCurrency === index}
                      onClick={() =>
                        handleToggleFavoriteCurrency(
                          index,
                          currency.id,
                          !currency.favorite,
                        )
                      }
                    />
                  );
                },
              },
            ]}
          />
        </Skeleton>
      </ContentContainer>
    </PageContainer>
  );
};

export default Currencies;
