import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Heading,
  useBreakpointValue,
  StackDirection,
  Skeleton,
  Flex,
  IconButton,
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';

import PageContainer from 'Components/Atoms/PageContainer';
import ContentContainer from 'Components/Atoms/ContentContainer';
import Header from 'Components/Organisms/Header';
import CreateTransactionForm from 'Components/Organisms/CreateTransactionForm';
import Form from 'Components/Atoms/Form';
import Select, { IOption } from 'Components/Atoms/Select';
import CreateTransferForm from 'Components/Organisms/CreateTransferForm';
import TransactionsHistory from 'Components/Organisms/TransactionsHistory';
import TransfersHistory from 'Components/Organisms/TransfersHistory';
import IWallet from 'Entities/IWallet';
import ICurrency from 'Entities/ICurrency';
import api from 'Services/api';
import { useErrors } from 'Hooks/errors';
import Balance from 'Components/Molecules/Balance/Balance';
import { getCurrency, getCurrencyDollarRate, getCurrencyName } from 'Helpers/getCurrency';
import Space from 'Components/Atoms/Space/Space';
import BalanceBadge from 'Components/Molecules/Balance/BalanceBadge';

interface IParams {
  id: string;
}

const Wallet: React.FC = () => {
  const { handleErrors } = useErrors();

  const params = useParams<IParams>();
  const stack = useBreakpointValue({
    base: {
      direction: 'column' as StackDirection,
    },
    lg: {
      direction: 'row' as StackDirection,
    },
  });

  const [wallet, setWallet] = useState({} as IWallet);
  const [currencies, setCurrencies] = useState([] as ICurrency[]);
  const [updateTransactions, setUpdateTransactions] = useState(0);
  const [updateTransfers, setUpdateTransfers] = useState(0);
  const [loadingFetchWallet, setLoadingFetchWallet] = useState(true);
  const [loadingFetchCurrencies, setLoadingFetchCurrencies] = useState(true);
  const [loadingFetchBalance, setLoadingFetchBalance] = useState(true);
  const [loadingFetchUserSettings, setLoadingFetchUserSettings] =
    useState(true);
  const [targetCurrencyId, setTargetCurrencyId] = useState('');
  const [baseCurrencyId, setBaseCurrencyId] = useState('');
  const [balance, setBalance] = useState(0);

  const currenciesOptions = useMemo<IOption[]>(
    () =>
      currencies.map(c => ({
        label: c.acronym,
        value: c.id,
      })),
    [currencies],
  );

  const fetchWallet = useCallback(async () => {
    try {
      setLoadingFetchWallet(true);
      const { id } = params;
      const response = await api.get(`wallets/${id}`);
      setWallet(response.data);
      setLoadingFetchWallet(false);
    } catch (err) {
      handleErrors('Error when fetchin wallet data', err);
    }
  }, [params, handleErrors]);

  const fetchCurrencies = useCallback(async () => {
    try {
      setLoadingFetchCurrencies(true);
      const response = await api.get('/currencies');
      setCurrencies(response.data);
      setLoadingFetchCurrencies(false);
    } catch (err) {
      handleErrors('Error when fetching currencies', err);
    }
  }, [handleErrors]);

  const fetchBalance = useCallback(
    async (id: string) => {
      try {
        setLoadingFetchBalance(true);

        const currency = currencies.find(c => c.id === targetCurrencyId);
        if (!currency) return;

        const response = await api.get('/wallets/balance', {
          params: {
            wallet_id: wallet.id,
            target_currency: currency.acronym,
          },
        });
        setBalance(response.data.balance);
        setLoadingFetchBalance(false);
      } catch (err) {
        handleErrors('Error when calculating total balance', err);
      }
    },
    [handleErrors, targetCurrencyId, currencies, wallet],
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
    fetchWallet();
  }, [fetchWallet]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  useEffect(() => {
    if (!targetCurrencyId) {
      if (!wallet) return;
      const { currency_id } = wallet;
      setTargetCurrencyId(currency_id);
      fetchBalance(currency_id);
      return;
    }
    fetchBalance(targetCurrencyId);
  }, [fetchBalance, targetCurrencyId, wallet]);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  return (
    <PageContainer>
      <Header />

      <ContentContainer flexDirection="column" justifyContent="start">
        <Skeleton isLoaded={!loadingFetchWallet}>
          <Heading>{`${wallet.alias} Wallet`}</Heading>
        </Skeleton>

        <Box mt="50px" w="100%">
          <Skeleton
            isLoaded={
              !loadingFetchWallet &&
              !loadingFetchCurrencies &&
              !loadingFetchBalance &&
              !loadingFetchUserSettings
            }
          >
            <SimpleGrid columns={2} spacing={10}>
              <Box>
                <Stat>
                  <StatLabel>Total balance</StatLabel>
                  <StatNumber>
                    <Balance
                      balance={balance}
                      currency={getCurrencyName(currencies, targetCurrencyId)}
                    />
                    <Space />
                    <BalanceBadge
                      balance={balance}
                      dollar_rate={
                        getCurrencyDollarRate(currencies, targetCurrencyId) /
                        getCurrencyDollarRate(currencies, baseCurrencyId)
                      }
                      currency={getCurrencyName(currencies, baseCurrencyId)}
                    />
                  </StatNumber>
                </Stat>
              </Box>

              <Box>
                <Flex justifyContent="end">
                  <Form onSubmit={() => fetchBalance(targetCurrencyId)}>
                    <Stack spacing="10px" direction="row">
                      <Select
                        onChange={e => setTargetCurrencyId(e.target.value)}
                        name="base_currency_id"
                        options={currenciesOptions}
                        value={targetCurrencyId}
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

        <Box w="100%" mt="50px">
          <Skeleton isLoaded={!loadingFetchWallet && !loadingFetchCurrencies}>
            <Tabs>
              <TabList>
                <Tab>Transactions</Tab>
                <Tab>Transfers</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Stack direction={stack?.direction} spacing="25px">
                    <TransactionsHistory
                      walletId={params.id}
                      updateTransactions={updateTransactions}
                    />
                    <CreateTransactionForm
                      wallet={wallet}
                      currencies={currencies}
                      targetCurrency={getCurrency(currencies, targetCurrencyId)}
                      baseCurrency={getCurrency(currencies, baseCurrencyId)}
                      onSuccess={() => {
                        setUpdateTransactions(updateTransactions + 1);
                        fetchWallet();
                      }}
                    />
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack direction={stack?.direction} spacing="25px">
                    <TransfersHistory
                      walletId={params.id}
                      updateTransfers={updateTransfers}
                    />
                    <CreateTransferForm
                      wallet={wallet}
                      currencies={currencies}
                      onSuccess={() => {
                        setUpdateTransfers(updateTransfers + 1);
                        fetchWallet();
                      }}
                    />
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Skeleton>
        </Box>
      </ContentContainer>
    </PageContainer>
  );
};

export default Wallet;
