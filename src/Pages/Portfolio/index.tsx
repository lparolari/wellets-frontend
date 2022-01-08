import React, { useState, useCallback, useEffect } from 'react';
import {
  Stack,
  Heading,
  useBreakpointValue,
  StackDirection,
  Skeleton,
  Link,
  Flex,
  useToast,
  LinkOverlay,
  IconButton,
} from '@chakra-ui/react';
import { FiCornerLeftUp } from 'react-icons/fi';

import PageContainer from 'Components/Atoms/PageContainer';
import ContentContainer from 'Components/Atoms/ContentContainer';
import Header from 'Components/Organisms/Header';
import Table from 'Components/Molecules/Table';
import UpsertPortfolioForm from 'Components/Organisms/UpsertPortfolioForm';

import { useErrors } from 'Hooks/errors';

import IPortfolio from 'Entities/IPortfolio';

import api from 'Services/api';
import Button from 'Components/Atoms/Button';
import { useHistory, useParams } from 'react-router-dom';

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

  const [selectedPortfolio, setSelectedPortfolio] = useState({} as IPortfolio);
  const [currentPortfolio, setCurrentPortfolio] = useState({} as IPortfolio);
  const [portfolios, setPortfolios] = useState([] as IPortfolio[]);
  const [loadingFetchPortfolios, setLoadingFetchPortfolios] = useState(false);
  const [loadingFetchPortfolio, setLoadingFetchPortfolio] = useState(false);
  const [loadingFetchCurrentPortfolios, setLoadingFetchCurrentPortfolio] =
    useState(false);
  const [loadingDeletePortfolio, setLoadingDeletePortfolio] = useState(false);

  const fetchPortfolios = useCallback(async () => {
    try {
      setLoadingFetchPortfolios(true);
      const { parent_id } = params;
      const response = await api.get(
        `/portfolios${parent_id ? '/' + parent_id : ''}`,
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
          `/portfolios/details${id ? '/' + id : ''}`,
        );
        setSelectedPortfolio(response.data);
      } catch (err) {
        handleErrors('Error when fetching portfolio', err);
      } finally {
        setLoadingFetchPortfolio(false);
      }
    },
    [params, handleErrors],
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

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  useEffect(() => {
    fetchCurrentPortfolio();
  }, [fetchCurrentPortfolio]);

  return (
    <PageContainer>
      <Header color="pink" />

      <ContentContainer flexDirection="column" justifyContent="start">
        <Skeleton isLoaded={!loadingFetchCurrentPortfolios}>
          <Heading>{currentPortfolio.alias} Portfolio</Heading>
          {currentPortfolio.id && (
            <Stack alignItems={'center'}>
              <IconButton
                onClick={() =>
                  history.push(
                    `/portfolios${
                      currentPortfolio.parent
                        ? '/' + currentPortfolio.parent.id
                        : ''
                    }`,
                  )
                }
                variant="outline"
                aria-label="Back"
                icon={<FiCornerLeftUp />}
              />
            </Stack>
          )}
        </Skeleton>

        <Stack mt="50px" w="100%" direction={stack?.direction} spacing="25px">
          <Skeleton isLoaded={!loadingFetchPortfolios}>
            <Table
              rows={portfolios}
              columns={[
                {
                  title: 'Portfolio',
                  key: 'alias',
                  render(x: IPortfolio) {
                    return <Link href={`/portfolios/${x.id}`}>{x.alias}</Link>;
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
                          <Link href={`/portfolios/${child.id}`} key={child.id}>
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
                          <Link href={`/wallets/${wallet.id}`} key={wallet.id}>
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
                            View
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
              setSelectedPortfolio({} as IPortfolio);
              fetchPortfolios();
            }}
            currentPortfolio={selectedPortfolio}
            onCancelUpdate={() => setSelectedPortfolio({} as IPortfolio)}
          />
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
};

export default Portfolio;
