import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Stack,
  Heading,
  useBreakpointValue,
  StackDirection,
  Skeleton,
  Box,
  Link,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  LinkOverlay,
  MenuGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { PieChart, Pie, LabelList, Tooltip } from 'recharts';

import { useErrors } from 'Hooks/errors';

import api from 'Services/api';

import formatPercentage from 'Helpers/formatPercentage';

import ContentContainer from 'Components/Atoms/ContentContainer';
import PageContainer from 'Components/Atoms/PageContainer';
import Space from 'Components/Atoms/Space/Space';
import Balance from 'Components/Molecules/Balance/Balance';
import Table from 'Components/Molecules/Table';
import Header from 'Components/Organisms/Header';

import ICurrency from 'Entities/ICurrency';
import IPortfolio from 'Entities/IPortfolio';
import IBalancedPortfolio from 'Entities/IBalancedPortfolio';
import formataBalance from 'Helpers/formatBalance';
import IAllocation, { IChange } from 'Entities/IAllocation';

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
      <Header color="purple" />

      <ContentContainer flexDirection="column" justifyContent="start">
        <Skeleton isLoaded={!loadingFetchPortfolio}>
          <Heading>
            Rebalance{' '}
            <Link href={`/portfolios/${portfolio.id}`}>{portfolio.alias}</Link>
          </Heading>
        </Skeleton>

        <Stack
          mt="50px"
          w="100%"
          direction={stack?.direction}
          spacing="25px"
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
                            ({x.portfolio.wallets.length})
                          </MenuButton>
                          <MenuList>
                            {x.portfolio.wallets.length ? (
                              <>
                                <MenuGroup>
                                  {x.portfolio.wallets.map(w => (
                                    <MenuItem
                                      key={w.id}
                                      onClick={() =>
                                        history.push(`/wallets/${w.id}`)
                                      }
                                    >
                                      {w.alias}
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
                                    Show all
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
