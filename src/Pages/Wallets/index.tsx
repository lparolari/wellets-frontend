import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  useToast,
  LinkBox,
  LinkOverlay,
  Flex,
  Stack,
  Heading,
  useBreakpointValue,
  StackDirection,
  Skeleton,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  Box,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import Button from 'Components/Atoms/Button';
import Form from 'Components/Atoms/Form';
import Select, { IOption } from 'Components/Atoms/Select';
import PageContainer from 'Components/Atoms/PageContainer';
import ContentContainer from 'Components/Atoms/ContentContainer';
import Table from 'Components/Molecules/Table';
import CreateWalletForm from 'Components/Organisms/CreateWalletForm';
import Header from 'Components/Organisms/Header';
import Space from 'Components/Atoms/Space/Space';
import Balance from 'Components/Molecules/Balance/Balance';
import BalanceBadge from 'Components/Molecules/Balance/BalanceBadge';

import { useErrors } from 'Hooks/errors';

import ICurrency from 'Entities/ICurrency';
import IWallet from 'Entities/IWallet';

import { getCurrency, getCurrencyName } from 'Helpers/getCurrency';

import api from 'Services/api';

const Wallets: React.FC = () => {
  const { handleErrors } = useErrors();
  const history = useHistory();

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
  const [wallets, setWallets] = useState([] as IWallet[]);
  const [totalWallets, setTotalWallets] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingDeleteWallet, setLoadingDeleteWallet] = useState(false);
  const [loadingFetchWallets, setLoadingFetchWallets] = useState(false);
  const [loadingFetchCurrencies, setLoadingFetchCurrencies] = useState(false);
  const [loadingFetchTotalBalance, setLoadingFetchTotalBalance] = useState(
    false,
  );
  const [loadingFetchUserSettings, setLoadingFetchUserSettings] = useState(
    false,
  );
  const [baseCurrencyId, setBaseCurrencyId] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);

  const limit = useMemo(() => 5, []);

  const currenciesOptions = useMemo<IOption[]>(
    () =>
      currencies.map(c => ({
        label: c.acronym,
        value: c.id,
      })),
    [currencies],
  );

  const fetchWallets = useCallback(async () => {
    try {
      setLoadingFetchWallets(true);
      const response = await api.get('/wallets', {
        params: {
          page,
          limit,
        },
      });
      setWallets(response.data.wallets);
      setTotalWallets(response.data.total);
    } catch (err) {
      handleErrors('Error when fetching wallets', err);
    } finally {
      setLoadingFetchWallets(false);
    }
  }, [page, limit, handleErrors]);

  const fetchCurrencies = useCallback(async () => {
    try {
      setLoadingFetchCurrencies(true);
      const response = await api.get('/currencies');
      setCurrencies(response.data);
    } catch (err) {
      handleErrors('Error when fetching currencies', err);
    } finally {
      setLoadingFetchCurrencies(false);
    }
  }, [handleErrors]);

  const handleDeleteWallet = useCallback(
    async (id: string) => {
      try {
        setLoadingDeleteWallet(true);
        await api.delete(`wallets/${id}`);
        toast({
          title: 'Wallet deleted',
          description: 'Your wallet has been successfully deleted',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchWallets();
      } catch (err) {
        handleErrors('Error when deleting wallet', err);
      } finally {
        setLoadingDeleteWallet(false);
      }
    },
    [toast, fetchWallets, handleErrors],
  );

  const fetchTotalBalance = useCallback(
    async (id: string) => {
      try {
        setLoadingFetchTotalBalance(true);
        const response = await api.get('/wallets/total-balance', {
          params: {
            base_currency_id: id,
          },
        });
        setTotalBalance(response.data.total_balance);
        setLoadingFetchTotalBalance(false);
      } catch (err) {
        handleErrors('Error when calculating total balance', err);
      }
    },
    [handleErrors],
  );

  const fetchUserSettings = useCallback(async () => {
    try {
      setLoadingFetchUserSettings(true);
      const response = await api.get('/users/settings');
      setBaseCurrencyId(response.data.currency_id);
    } catch (err) {
      // fail silently, proceed with default
    } finally {
      setLoadingFetchUserSettings(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets, history]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  useEffect(() => {
    if (!baseCurrencyId) return;
    fetchTotalBalance(baseCurrencyId);
  }, [fetchTotalBalance, baseCurrencyId, wallets]);

  return (
    <PageContainer>
      <Header />

      <ContentContainer flexDirection="column" justifyContent="start">
        <Heading>Wallets</Heading>

        <Box mt="10px" w="100%">
          <Skeleton
            isLoaded={
              !loadingFetchCurrencies &&
              !loadingFetchTotalBalance &&
              !loadingFetchUserSettings
            }
          >
            <SimpleGrid columns={2} spacing={10}>
              <Box>
                <Stat>
                  <StatLabel>Total balance</StatLabel>
                  <StatNumber>
                    <Balance
                      balance={totalBalance}
                      currency={getCurrencyName(currencies, baseCurrencyId)}
                    />
                  </StatNumber>
                </Stat>
              </Box>

              <Box>
                <Flex justifyContent="end">
                  <Form onSubmit={() => fetchTotalBalance(baseCurrencyId)}>
                    <Stack spacing="10px" direction="row">
                      <Select
                        onChange={e => setBaseCurrencyId(e.target.value)}
                        name="base_currency_id"
                        options={currenciesOptions}
                        value={baseCurrencyId}
                      />
                      <IconButton
                        type="submit"
                        colorScheme="green"
                        variant="outline"
                        aria-label="Refresh"
                        icon={<FiRefreshCw />}
                      />
                    </Stack>
                  </Form>
                </Flex>
              </Box>
            </SimpleGrid>
          </Skeleton>
        </Box>

        <Stack mt="50px" w="100%" direction={stack?.direction} spacing="25px">
          <Skeleton isLoaded={!loadingFetchWallets && !loadingFetchCurrencies}>
            <Table
              rows={wallets}
              columns={[
                {
                  title: 'Alias',
                  key: 'alias',
                  dataIndex: 'alias',
                },
                {
                  title: 'Currency',
                  key: 'currency',
                  render(wallet: IWallet) {
                    return getCurrencyName(currencies, wallet.currency_id);
                  },
                },
                {
                  title: 'Balance',
                  key: 'balance',
                  render(wallet: IWallet) {
                    const { balance, currency_id } = wallet;

                    const currency = getCurrency(currencies, currency_id);
                    const currencyName =
                      getCurrencyName(currencies, currency_id) || 'USD';

                    const baseCurrency = getCurrency(
                      currencies,
                      baseCurrencyId,
                    );

                    return (
                      currency && (
                        <>
                          <Balance balance={balance} currency={currencyName} />
                          {baseCurrency && (
                            <>
                              <Space />
                              <BalanceBadge
                                balance={balance}
                                currency={baseCurrency?.acronym}
                                dollar_rate={
                                  currency.dollar_rate /
                                  baseCurrency.dollar_rate
                                }
                              />
                            </>
                          )}
                        </>
                      )
                    );
                  },
                  sort: (a: IWallet, b: IWallet) => {
                    const a_currency = getCurrency(currencies, a.currency_id);
                    const b_currency = getCurrency(currencies, b.currency_id);

                    const a_dollar_rate = a_currency?.dollar_rate || 1;
                    const b_dollar_rate = b_currency?.dollar_rate || 1;

                    return (
                      a.balance / a_dollar_rate - b.balance / b_dollar_rate
                    );
                  },
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render(wallet: IWallet) {
                    return (
                      <Flex>
                        <LinkBox>
                          <Button mr="10px">
                            <LinkOverlay href={`/wallets/${wallet.id}`}>
                              View
                            </LinkOverlay>
                          </Button>
                        </LinkBox>
                        <Button
                          type="button"
                          isLoading={loadingDeleteWallet}
                          onClick={() => handleDeleteWallet(wallet.id)}
                          confirmation={{
                            body:
                              'Are you sure you want to delete this wallet? All data attached to it will be lost.',
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
              pagination={{
                limit,
                currentPage: page,
                total: totalWallets,
                setPage,
              }}
            />
          </Skeleton>

          <CreateWalletForm onSuccess={fetchWallets} />
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
};

export default Wallets;
