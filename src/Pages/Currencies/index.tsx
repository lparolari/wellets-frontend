import { Box, Heading, Icon, IconButton, Skeleton } from '@chakra-ui/react';
import { Breadcrumb } from 'Components/Atoms/Breadcrumb';
import ContentContainer from 'Components/Atoms/ContentContainer';
import PageContainer from 'Components/Atoms/PageContainer';
import Balance from 'Components/Molecules/Balance/Balance';
import Table from 'Components/Molecules/Table';
import Header from 'Components/Organisms/Header';
import ICurrency from 'Entities/ICurrency';
import { useErrors } from 'Hooks/errors';
import useFetchCurrencies from 'Hooks/useFetchCurrencies';
import React, { useCallback, useEffect, useState } from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import api from 'Services/api';

const Currencies: React.FC = () => {
  const { handleErrors } = useErrors();

  const { currencies, isFetching, fetchCurrencies } = useFetchCurrencies();

  const [loadingMarkAsFavoriteCurrency, setLoadingMarkAsFavoriteCurrency] =
    useState(-1);

  const handleToggleFavoriteCurrency = useCallback(
    async (index: number, id: string, favorite: boolean) => {
      try {
        setLoadingMarkAsFavoriteCurrency(index);
        await api.put(`/currencies/${id}`, { favorite });
        // fetchAllCurrencies(false);
      } catch (err) {
        handleErrors('Error when toggling favorite currency', err);
      } finally {
        setLoadingMarkAsFavoriteCurrency(-1);
      }
    },
    [handleErrors],
  );

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return (
    <PageContainer>
      <Header color="blue" />

      <Box m="1rem">
        <Skeleton isLoaded>
          <Breadcrumb
            items={[
              { label: 'Wellets', to: '/' },
              { label: 'Currencies', to: '/currencies' },
            ]}
          />
        </Skeleton>
      </Box>

      <ContentContainer flexDirection="column" justifyContent="start">
        <Box mb="1rem">
          <Heading>All Currencies</Heading>
        </Box>

        <Box mt="1rem">
          <Skeleton isLoaded={!isFetching}>
            <Table
              rows={currencies || []}
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
                    return `${Number(currency.dollar_rate).toFixed(8)}`;
                  },
                  sort: (a: ICurrency, b: ICurrency) =>
                    a.dollar_rate - b.dollar_rate,
                },
                {
                  title: 'Dollar Value',
                  key: 'dollar_value',
                  render(currency: ICurrency) {
                    return (
                      <Balance balance={1} dollar_rate={currency.dollar_rate} />
                    );
                  },
                  sort: (a: ICurrency, b: ICurrency) =>
                    a.dollar_rate - b.dollar_rate,
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
        </Box>
      </ContentContainer>
    </PageContainer>
  );
};

export default Currencies;
