import { Box, Heading, Icon, IconButton, Skeleton } from '@chakra-ui/react';
import { Breadcrumb } from 'Components/Atoms/Breadcrumb';
import ContentContainer from 'Components/Atoms/ContentContainer';
import PageContainer from 'Components/Atoms/PageContainer';
import Balance from 'Components/Molecules/Balance/Balance';
import Table from 'Components/Molecules/Table';
import Header from 'Components/Organisms/Header';
import ICurrency from 'Entities/ICurrency';
import useFetchCurrencies from 'Hooks/useFetchCurrencies';
import useUpdateCurrency from 'Hooks/useUpdateCurrency';
import React, { useEffect, useState } from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

const Currencies: React.FC = () => {
  const { currencies, isFetching, fetchCurrencies, replaceCurrency } =
    useFetchCurrencies();
  const { updateCurrency } = useUpdateCurrency();

  const [updatingIndex, setUpdatingIndex] = useState<number>();

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
          <Heading>Currencies</Heading>
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
                        isLoading={updatingIndex === index}
                        onClick={() => {
                          setUpdatingIndex(index);
                          updateCurrency({
                            id: currency.id,
                            currency: { favorite: !currency.favorite },
                            onUpdated: (newCurrency: ICurrency) => {
                              replaceCurrency(newCurrency);
                              setUpdatingIndex(undefined);
                            },
                          });
                        }}
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
