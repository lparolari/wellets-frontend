import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Stack,
  Heading,
  useBreakpointValue,
  StackDirection,
  Skeleton,
  Box,
  Link,
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

  const [portfolio, setPortfolio] = useState({} as IPortfolio);
  const [balanced, setBalanced] = useState([] as IBalancedPortfolio[]);
  const [baseCurrency, setBaseCurrency] = useState({} as ICurrency);
  const [loadingFetchPortfolio, setLoadingFetchPortfolio] = useState(false);
  const [loadingFetchBalanced, setLoadingFetchBalanced] = useState(false);

  const targetPercentageData = useMemo(
    () =>
      balanced.map(p => ({ name: p.alias, value: formatPercentage(p.weight) })),
    [balanced],
  );
  const actualBalanceData = useMemo(
    () =>
      balanced.map(p => ({
        name: p.alias,
        value: p.actual_value,
      })),
    [balanced],
  );

  const fetchPortfolio = useCallback(
    async (id: string) => {
      try {
        setLoadingFetchPortfolio(true);
        const response = await api.get(`/portfolios/${id}`);
        setPortfolio(response.data);
      } catch (err) {
        handleErrors('Error when fetching portfolio', err);
      } finally {
        setLoadingFetchPortfolio(false);
      }
    },
    [handleErrors],
  );

  const fetchBalanced = useCallback(
    async (id: string) => {
      try {
        setLoadingFetchBalanced(true);
        const response = await api.get(`/portfolios/${id}/rebalance`);
        setBalanced(response.data.balanced_portfolios);
        setBaseCurrency(response.data.base_currency);
      } catch (err) {
        handleErrors('Error when rebalancing portfolios', err);
      } finally {
        setLoadingFetchBalanced(false);
      }
    },
    [handleErrors],
  );

  useEffect(() => {
    fetchPortfolio(params.id);
  }, [params.id, fetchPortfolio]);

  useEffect(() => {
    fetchBalanced(params.id);
  }, [params.id, fetchBalanced]);

  return (
    <PageContainer>
      <Header color="purple" />

      <ContentContainer flexDirection="column" justifyContent="start">
        <Skeleton isLoaded={!loadingFetchPortfolio}>
          <Heading>{`Rebalance ${portfolio.alias}`}</Heading>
        </Skeleton>

        <Stack
          mt="50px"
          w="100%"
          direction={stack?.direction}
          spacing="25px"
          justifyContent="center"
        >
          <Skeleton isLoaded={!loadingFetchBalanced}>
            <Table
              rows={balanced}
              columns={[
                {
                  title: 'Portfolio',
                  key: 'alias',
                  render(x: IBalancedPortfolio) {
                    return (
                      <Link href={`/portfolio/${x.id}/rebalance`} key={x.id}>
                        {x.alias}
                      </Link>
                    );
                  },
                },
                {
                  title: 'Weight',
                  key: 'weight',
                  render(x: IBalancedPortfolio) {
                    return `${Number(x.weight * 100).toFixed(0)}%`;
                  },
                },
                {
                  title: 'Target',
                  key: 'target',
                  render(x: IBalancedPortfolio) {
                    return (
                      <Balance
                        balance={x.target_value}
                        currency={baseCurrency.acronym}
                      />
                    );
                  },
                },
                {
                  title: 'Actual',
                  key: 'actual',
                  render(x: IBalancedPortfolio) {
                    return (
                      <Balance
                        balance={x.actual_value}
                        currency={baseCurrency.acronym}
                      />
                    );
                  },
                },
                {
                  title: 'Off By',
                  key: 'off_by',
                  render(x: IBalancedPortfolio) {
                    return `${Number(x.off_by * 100).toFixed(0)}%`;
                  },
                },
                {
                  title: 'Rebalance',
                  key: 'rebalance',
                  render(x: IBalancedPortfolio) {
                    return (
                      <>
                        {x.off_by > 0 ? 'Sell' : 'Buy'}
                        <Space />
                        <Balance
                          balance={x.rebalance_amount}
                          currency={baseCurrency.acronym}
                        />
                      </>
                    );
                  },
                },
              ]}
            />
          </Skeleton>

          <Skeleton isLoaded={!loadingFetchBalanced && !loadingFetchPortfolio}>
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
                      currency: baseCurrency.acronym || 'UNK',
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
