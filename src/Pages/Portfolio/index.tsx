import {
  Box,
  Flex,
  Heading,
  LinkOverlay,
  SimpleGrid,
  Skeleton,
  Stack,
  StackDirection,
  Stat,
  StatLabel,
  StatNumber,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { Breadcrumb } from 'Components/Atoms/Breadcrumb';
import Button from 'Components/Atoms/Button';
import ContentContainer from 'Components/Atoms/ContentContainer';
import PageContainer from 'Components/Atoms/PageContainer';
import Balance from 'Components/Molecules/Balance/Balance';
import Table from 'Components/Molecules/Table';
import Header from 'Components/Organisms/Header';
import UpsertPortfolioForm from 'Components/Organisms/UpsertPortfolioForm';
import IPortfolio from 'Entities/IPortfolio';
import IUserSettings from 'Entities/IUserSettings';
import { useErrors } from 'Hooks/errors';
import React, { useCallback, useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { Link, useHistory, useParams } from 'react-router-dom';
import api from 'Services/api';

interface IParams {
  parent_id: string;
}

const Portfolio: React.FC = () => {
  const { handleErrors } = useErrors();

  const history = useHistory();
  const params = useParams<IParams>();
  const toast = useToast();
  const stack = useBreakpointValue({
    base: {
      direction: 'column' as StackDirection,
    },
    lg: {
      direction: 'row' as StackDirection,
    },
  });

  const [userSettings, setUserSettings] = useState({} as IUserSettings);
  const [selectedPortfolio, setSelectedPortfolio] = useState<IPortfolio>();
  const [currentPortfolio, setCurrentPortfolio] = useState({} as IPortfolio);
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [portfolios, setPortfolios] = useState([] as IPortfolio[]);
  const [loadingFetchUserSettings, setLoadingFetchUserSettings] =
    useState(false);
  const [loadingFetchPortfolios, setLoadingFetchPortfolios] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingFetchPortfolio, setLoadingFetchPortfolio] = useState(false);
  const [loadingFetchPortfolioBalance, setLoadingFetchPortfolioBalance] =
    useState(false);
  const [loadingFetchCurrentPortfolios, setLoadingFetchCurrentPortfolio] =
    useState(false);
  const [loadingDeletePortfolio, setLoadingDeletePortfolio] = useState(false);

  const fetchPortfolios = useCallback(async () => {
    try {
      setLoadingFetchPortfolios(true);
      const { parent_id } = params;
      const response = await api.get(
        `/portfolios${parent_id ? `/${parent_id}` : ''}`,
      );
      setPortfolios(response.data);
    } catch (err) {
      handleErrors('Error when fetching portfolios', err);
    } finally {
      setLoadingFetchPortfolios(false);
    }
  }, [params, handleErrors]);

  const fetchPortfolio = useCallback(
    async (id?: string) => {
      try {
        setLoadingFetchPortfolio(true);
        const response = await api.get(
          `/portfolios/details${id ? `/${id}` : ''}`,
        );
        setSelectedPortfolio(response.data);
      } catch (err) {
        handleErrors('Error when fetching portfolio', err);
      } finally {
        setLoadingFetchPortfolio(false);
      }
    },
    [handleErrors],
  );

  const fetchPortfolioBalance = useCallback(
    async (id?: string, _baseCurrency?: string) => {
      try {
        setLoadingFetchPortfolioBalance(true);
        const response = await api.get(
          `/portfolios/${id ? `${id}/` : ''}balance`,
        );
        setPortfolioBalance(response.data.balance);
      } catch (err) {
        handleErrors('Error when fetching portfolio balance', err);
      } finally {
        setLoadingFetchPortfolioBalance(false);
      }
    },
    [handleErrors],
  );

  const fetchCurrentPortfolio = useCallback(async () => {
    try {
      const { parent_id } = params;
      if (!parent_id) {
        setCurrentPortfolio({} as IPortfolio);
        return;
      }

      setLoadingFetchCurrentPortfolio(true);
      const response = await api.get(`/portfolios/details/${parent_id}`);
      setCurrentPortfolio(response.data);
    } catch (err) {
      handleErrors('Error when fetching current portfolio', err);
    } finally {
      setLoadingFetchCurrentPortfolio(false);
    }
  }, [params, handleErrors]);

  const handleDeletePortfolio = useCallback(
    async (id: string) => {
      try {
        setLoadingDeletePortfolio(true);
        await api.delete(`/portfolios/${id}`);
        toast({
          title: 'Portfolio deleted',
          description: 'Your portfolio was successfully deleted',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        fetchPortfolios();
      } catch (err) {
        handleErrors('Error when deleting portfolio', err);
      } finally {
        setLoadingDeletePortfolio(false);
      }
    },
    [toast, handleErrors, fetchPortfolios],
  );

  const fetchUserSettings = useCallback(async () => {
    try {
      setLoadingFetchUserSettings(true);
      const response = await api.get('/users/settings');
      setUserSettings(response.data);
    } catch (err) {
      handleErrors('Error when fetching user settings', err);
    } finally {
      setLoadingFetchUserSettings(false);
    }
  }, [handleErrors]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  useEffect(() => {
    fetchCurrentPortfolio();
  }, [fetchCurrentPortfolio]);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  useEffect(() => {
    fetchPortfolioBalance(currentPortfolio.id);
  }, [fetchPortfolioBalance, currentPortfolio]);

  return (
    <PageContainer>
      <Header color="pink" />

      <Box m="1rem">
        <Skeleton isLoaded={!loadingFetchCurrentPortfolios}>
          <Breadcrumb
            items={[
              { label: 'Wellets', to: '/' },
              { label: 'Portfolios', to: '/portfolios' },
              ...(currentPortfolio.id
                ? currentPortfolio.parent
                  ? [
                      {
                        label: currentPortfolio.parent.alias,
                        to: `/portfolios/${currentPortfolio.parent.id}`,
                      },
                    ]
                  : []
                : []),
              ...(currentPortfolio.id
                ? [
                    {
                      label: currentPortfolio.alias,
                      to: `/portfolios/${currentPortfolio.id}`,
                    },
                  ]
                : []),
            ]}
          />
        </Skeleton>
      </Box>

      <ContentContainer flexDirection="column" justifyContent="start">
        <Box>
          <Skeleton isLoaded={!loadingFetchCurrentPortfolios}>
            <Heading>
              {currentPortfolio.id
                ? `${currentPortfolio.alias} Portfolio`
                : `Portfolios`}
            </Heading>
          </Skeleton>
        </Box>

        <Box mt="1rem" w="100%">
          <Skeleton
            isLoaded={
              !loadingFetchPortfolioBalance && !loadingFetchUserSettings
            }
          >
            <SimpleGrid columns={2} spacing={10}>
              <Box>
                <Stat>
                  <StatLabel>Total balance</StatLabel>
                  <StatNumber>
                    <Balance
                      balance={portfolioBalance}
                      currency={userSettings?.currency?.acronym}
                    />
                  </StatNumber>
                </Stat>
              </Box>

              <Box>
                <Flex justifyContent="end">
                  {currentPortfolio.id && (
                    <Button
                      onClick={() =>
                        history.push(
                          `/portfolios/${
                            currentPortfolio.id ? `${currentPortfolio.id}/` : ''
                          }rebalance`,
                        )
                      }
                      rightIcon={<FiCheckCircle />}
                    >
                      Rebalance
                    </Button>
                  )}
                </Flex>
              </Box>
            </SimpleGrid>
          </Skeleton>
        </Box>

        <Stack mt="1rem" w="100%" direction={stack?.direction} spacing="2rem">
          <Skeleton isLoaded={!loadingFetchPortfolios}>
            <Table
              rows={portfolios}
              columns={[
                {
                  title: 'Portfolio',
                  key: 'alias',
                  render(x: IPortfolio) {
                    return <Link to={`/portfolios/${x.id}`}>{x.alias}</Link>;
                  },
                },
                {
                  title: 'Weight',
                  key: 'weight',
                  render(x: IPortfolio) {
                    return `${Number(x.weight * 100).toFixed(0)}%`;
                  },
                },
                {
                  title: 'Children',
                  key: 'children',
                  render(x: IPortfolio) {
                    return (
                      <>
                        {x.children.map((child, i) => (
                          <Link to={`/portfolios/${child.id}`} key={child.id}>
                            {`${child.alias}${
                              i === x.children.length - 1 ? '' : ', '
                            }`}
                          </Link>
                        ))}
                      </>
                    );
                  },
                },
                {
                  title: 'Wallets',
                  key: 'wallets',
                  render(x: IPortfolio) {
                    return (
                      <>
                        {x.wallets.map((wallet, i) => (
                          <Link to={`/wallets/${wallet.id}`} key={wallet.id}>
                            {`${wallet.alias}${
                              i === x.wallets.length - 1 ? '' : ', '
                            }`}
                          </Link>
                        ))}
                      </>
                    );
                  },
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render(x: IPortfolio) {
                    return (
                      <Flex>
                        <Button mr="10px">
                          <LinkOverlay href={`/portfolios/${x.id}/rebalance`}>
                            Rebalance
                          </LinkOverlay>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => fetchPortfolio(x.id)}
                          mr="10px"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          isLoading={loadingDeletePortfolio}
                          onClick={() => handleDeletePortfolio(x.id)}
                          confirmation={{
                            body: 'Are you sure you want to delete this portfolio? Every child portfolio (if any) will be deleted.',
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

          <UpsertPortfolioForm
            onSuccess={() => {
              setSelectedPortfolio(undefined);
              fetchPortfolios();
            }}
            currentPortfolio={selectedPortfolio}
            defaultParentPortfolio={currentPortfolio}
            onCancelUpdate={() => setSelectedPortfolio(undefined)}
          />
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
};

export default Portfolio;
