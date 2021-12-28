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
} from '@chakra-ui/react';

import PageContainer from 'Components/Atoms/PageContainer';
import ContentContainer from 'Components/Atoms/ContentContainer';
import Header from 'Components/Organisms/Header';
import Table from 'Components/Molecules/Table';
import UpsertPocketForm from 'Components/Organisms/UpsertPocketForm';

import { useErrors } from 'Hooks/errors';

import IPocket from 'Entities/IPocket';

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

  const [currentPocket, setCurrentPocket] = useState({} as IPocket);
  const [pockets, setPockets] = useState([] as IPocket[]);
  const [loadingFetchPockets, setLoadingFetchPockets] = useState(false);
  const [loadingDeletePocket, setLoadingDeletePocket] = useState(false);

  const fetchPockets = useCallback(async () => {
    try {
      setLoadingFetchPockets(true);
      const response = await api.get('/pockets');
      setPockets(response.data);
    } catch (err) {
      handleErrors('Error when fetching pockets', err);
    } finally {
      setLoadingFetchPockets(false);
    }
  }, [handleErrors]);

  const handleDeletePocket = useCallback(
    async (id: string) => {
      try {
        setLoadingDeletePocket(true);
        await api.delete(`/pockets/${id}`);
        toast({
          title: 'Pocket deleted',
          description: 'Your pocket was successfully deleted',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchPockets();
      } catch (err) {
        handleErrors('Error when deleting pocket', err);
      } finally {
        setLoadingDeletePocket(false);
      }
    },
    [toast, handleErrors, fetchPockets],
  );

  useEffect(() => {
    fetchPockets();
  }, [fetchPockets]);

  return (
    <PageContainer>
      <Header color="pink" />

      <ContentContainer flexDirection="column" justifyContent="start">
        <Heading>Portfolio</Heading>

        <Stack mt="50px" w="100%" direction={stack?.direction} spacing="25px">
          <Skeleton isLoaded={!loadingFetchPockets}>
            <Table
              rows={pockets}
              columns={[
                {
                  title: 'Pocket',
                  key: 'alias',
                  dataIndex: 'alias',
                },
                {
                  title: 'Parent',
                  key: 'parent',
                  render(pocket: IPocket) {
                    return pocket.parent ? pocket.parent.alias : '(root)';
                  },
                },
                {
                  title: 'Wallets',
                  key: 'wallets',
                  render(pocket: IPocket) {
                    return (
                      <>
                        {pocket.wallets.map((wallet, i) => (
                          <Link href={`/wallets/${wallet.id}`} key={wallet.id}>
                            {`${wallet.alias}${
                              i === pocket.wallets.length - 1 ? '' : ', '
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
                  render(pocket: IPocket) {
                    return `${Number(pocket.weight * 100).toFixed(0)}%`;
                  },
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render(pocket: IPocket) {
                    return (
                      <Flex>
                        <Button
                          type="button"
                          onClick={() =>
                            setCurrentPocket({
                              ...pocket,
                            })
                          }
                          mr="10px"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          isLoading={loadingDeletePocket}
                          onClick={() => handleDeletePocket(pocket.id)}
                          confirmation={{
                            body:
                              'Are you sure you want to delete this pocket? Every child pocket (if any) will be deleted.',
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

          <UpsertPocketForm
            onSuccess={() => {
              setCurrentPocket({} as IPocket);
              fetchPockets();
            }}
            currentPocket={currentPocket}
            onCancelUpdate={() => setCurrentPocket({} as IPocket)}
          />
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
};

export default Portfolio;
