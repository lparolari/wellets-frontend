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
} from '@chakra-ui/react';

import PageContainer from 'Components/Atoms/PageContainer';
import ContentContainer from 'Components/Atoms/ContentContainer';
import Header from 'Components/Organisms/Header';
import Table from 'Components/Molecules/Table';
import UpsertPortfolioForm from 'Components/Organisms/UpsertPortfolioForm';

import { useErrors } from 'Hooks/errors';

import IPortfolio from 'Entities/IPortfolio';

import api from 'Services/api';
import Button from 'Components/Atoms/Button';

const Portfolio: React.FC = () => {
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

  const [currentPortfolio, setCurrentPortfolio] = useState({} as IPortfolio);
  const [portfolios, setPortfolios] = useState([] as IPortfolio[]);
  const [loadingFetchPortfolios, setLoadingFetchPortfolios] = useState(false);
  const [loadingDeletePortfolio, setLoadingDeletePortfolio] = useState(false);

  const fetchPortfolios = useCallback(async () => {
    try {
      setLoadingFetchPortfolios(true);
      const response = await api.get('/portfolios');
      setPortfolios(response.data);
    } catch (err) {
      handleErrors('Error when fetching portfolios', err);
    } finally {
      setLoadingFetchPortfolios(false);
    }
  }, [handleErrors]);

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

  return (
    <PageContainer>
      <Header color="pink" />

      <ContentContainer flexDirection="column" justifyContent="start">
        <Heading>Portfolio</Heading>

        <Stack mt="50px" w="100%" direction={stack?.direction} spacing="25px">
          <Skeleton isLoaded={!loadingFetchPortfolios}>
            <Table
              rows={portfolios}
              columns={[
                {
                  title: 'Portfolio',
                  key: 'alias',
                  dataIndex: 'alias',
                },
                {
                  title: 'Parent',
                  key: 'parent',
                  render(x: IPortfolio) {
                    return x.parent ? x.parent.alias : '(root)';
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
                  title: 'Weight',
                  key: 'weight',
                  render(x: IPortfolio) {
                    return `${Number(x.weight * 100).toFixed(0)}%`;
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
                          onClick={() =>
                            setCurrentPortfolio({
                              ...x,
                            })
                          }
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
              setCurrentPortfolio({} as IPortfolio);
              fetchPortfolios();
            }}
            currentPortfolio={currentPortfolio}
            onCancelUpdate={() => setCurrentPortfolio({} as IPortfolio)}
          />
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
};

export default Portfolio;
