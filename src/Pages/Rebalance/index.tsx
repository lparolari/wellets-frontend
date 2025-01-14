import {
  Badge,
  Box,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  StackDirection,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Breadcrumb } from 'Components/Atoms/Breadcrumb';
import ContentContainer from 'Components/Atoms/ContentContainer';
import PageContainer from 'Components/Atoms/PageContainer';
import Space from 'Components/Atoms/Space/Space';
import Balance from 'Components/Molecules/Balance/Balance';
import Table from 'Components/Molecules/Table';
import Header from 'Components/Organisms/Header';
import IAllocation, { IChange } from 'Entities/IAllocation';
import IPortfolio from 'Entities/IPortfolio';
import formataBalance from 'Helpers/formatBalance';
import formatPercentage from 'Helpers/formatPercentage';
import { useErrors } from 'Hooks/errors';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { LabelList, Pie, PieChart, Tooltip } from 'recharts';
import api from 'Services/api';

import { isWalletChild } from './utils';

interface IParams {
  id: string;
}

const Portfolio: React.FC = () => {
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
  const history = useHistory();

  const [portfolio, setPortfolio] = useState({} as IPortfolio);
  const [allocation, setAllocation] = useState({} as IAllocation);

  const [loadingFetchPortfolio, setLoadingFetchPortfolio] = useState(false);
  const [loadingFetchAllocation, setLoadingFetchAllocation] = useState(false);

  const targetPercentageData = useMemo(
    () =>
      allocation.changes &&
      allocation.changes.map(a => ({
        name: a.portfolio.alias,
        value: formatPercentage(a.portfolio.weight),
      })),
    [allocation],
  );
  const actualBalanceData = useMemo(
    () =>
      allocation.changes &&
      allocation.changes.map(a => ({
        name: a.portfolio.alias,
        value: a.actual,
      })),
    [allocation],
  );

  const fetchPortfolio = useCallback(
    async (id: string) => {
      try {
        setLoadingFetchPortfolio(true);
        const response = await api.get(`/portfolios/${id}/details`);
        setPortfolio(response.data);
      } catch (err) {
        handleErrors('Error when fetching portfolio', err);
      } finally {
        setLoadingFetchPortfolio(false);
      }
    },
    [handleErrors],
  );

  const fetchAllocation = useCallback(
    async (id: string) => {
      try {
        setLoadingFetchAllocation(true);
        const response = await api.get(`/portfolios/${id}/rebalance`);
        setAllocation(response.data);
      } catch (err) {
        handleErrors('Error when rebalancing portfolios', err);
      } finally {
        setLoadingFetchAllocation(false);
      }
    },
    [handleErrors],
  );

  useEffect(() => {
    fetchPortfolio(params.id);
  }, [params.id, fetchPortfolio]);

  useEffect(() => {
    fetchAllocation(params.id);
  }, [params.id, fetchAllocation]);

  return (
    <PageContainer>
      <Header color="pink" />

      <Box m="1rem">
        <Skeleton isLoaded={!loadingFetchPortfolio}>
          <Breadcrumb
            items={[
              { label: 'Wellets', to: '/' },
              { label: 'Portfolios', to: '/portfolios' },
              ...(portfolio.id
                ? portfolio.parent
                  ? [
                      {
                        label: portfolio.parent.alias,
                        to: `/portfolios/${portfolio.parent.id}`,
                      },
                    ]
                  : []
                : []),
              ...(portfolio.id
                ? [
                    {
                      label: portfolio.alias,
                      to: `/portfolios/${portfolio.id}`,
                    },
                  ]
                : []),
            ]}
          />
        </Skeleton>
      </Box>

      <ContentContainer flexDirection="column" justifyContent="start">
        <Skeleton isLoaded={!loadingFetchPortfolio}>
          <Heading>
            Rebalance{' '}
            <Link href={`/portfolios/${portfolio.id}`}>{portfolio.alias}</Link>
          </Heading>
        </Skeleton>

        <Stack
          mt="1rem"
          w="100%"
          direction={stack?.direction}
          spacing="2rem"
          justifyContent="center"
        >
          <Skeleton isLoaded={!loadingFetchAllocation}>
            <Table
              rows={allocation.changes || []}
              columns={[
                {
                  title: 'Portfolio',
                  key: 'alias',
                  render(x: IChange) {
                    return (
                      <>
                        <Link
                          href={`/portfolios/${x.portfolio.id}`}
                          key={x.portfolio.id}
                        >
                          {x.portfolio.alias}
                        </Link>{' '}
                        <Menu>
                          <MenuButton as={Link}>
                            ({x.wallets.length})
                          </MenuButton>
                          <MenuList>
                            {x.wallets.length ? (
                              <>
                                <MenuGroup>
                                  {x.wallets.map(w => (
                                    <MenuItem
                                      key={w.id}
                                      onClick={() =>
                                        history.push(`/wallets/${w.id}`)
                                      }
                                    >
                                      <Flex
                                        direction="row"
                                        justify="space-between"
                                        flex="1"
                                      >
                                        {w.alias}
                                        {isWalletChild(w, x.portfolio) && (
                                          <Badge>child</Badge>
                                        )}
                                      </Flex>
                                    </MenuItem>
                                  ))}
                                </MenuGroup>
                                <MenuDivider />
                                <MenuGroup>
                                  <MenuItem
                                    onClick={() =>
                                      history.push(
                                        `/wallets/?portfolio_id=${x.portfolio.id}`,
                                      )
                                    }
                                  >
                                    View wallets beloging to {x.portfolio.alias}
                                  </MenuItem>
                                </MenuGroup>
                              </>
                            ) : (
                              <MenuItem isDisabled>No wallets</MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </>
                    );
                  },
                },
                {
                  title: 'Weight',
                  key: 'weight',
                  render(x: IChange) {
                    return `${Number(x.portfolio.weight * 100).toFixed(0)}%`;
                  },
                },
                {
                  title: 'Target',
                  key: 'target',
                  render(x: IChange) {
                    return (
                      <Balance
                        balance={x.target}
                        currency={allocation.base_currency.acronym}
                      />
                    );
                  },
                },
                {
                  title: 'Actual',
                  key: 'actual',
                  render(x: IChange) {
                    return (
                      <Balance
                        balance={x.actual}
                        currency={allocation.base_currency.acronym}
                      />
                    );
                  },
                },
                {
                  title: 'Off By',
                  key: 'off_by',
                  render(x: IChange) {
                    return `${Number(x.off_by * 100).toFixed(0)}%`;
                  },
                },
                {
                  title: 'Rebalance',
                  key: 'rebalance',
                  render(x: IChange) {
                    return (
                      <>
                        {x.action.type === 'sell' ? 'Sell' : 'Buy'}
                        <Space />
                        <Balance
                          balance={x.action.amount}
                          currency={allocation.base_currency.acronym}
                        />
                      </>
                    );
                  },
                },
              ]}
            />
          </Skeleton>

          <Skeleton
            isLoaded={!loadingFetchAllocation && !loadingFetchPortfolio}
          >
            <Box>
              <PieChart height={250} width={400}>
                <Pie
                  isAnimationActive={false}
                  data={targetPercentageData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                >
                  <LabelList
                    dataKey="value"
                    position="inside"
                    strokeWidth="0"
                    fill="white"
                    formatter={(value: number) => `${value}%`}
                  />
                </Pie>
                <Pie
                  isAnimationActive={false}
                  data={actualBalanceData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  fill="#82ca9d"
                  labelLine
                  label={cell =>
                    formataBalance(cell.value, undefined, {
                      currency: allocation.base_currency.acronym || 'UNK',
                    })
                  }
                />
                <Tooltip />
              </PieChart>
            </Box>
          </Skeleton>
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
};

export default Portfolio;
