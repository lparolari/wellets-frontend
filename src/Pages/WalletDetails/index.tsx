import { Box, Heading, Skeleton } from '@chakra-ui/react';
import ContentContainer from 'Components/Atoms/ContentContainer';
import PageContainer from 'Components/Atoms/PageContainer';
import Header from 'Components/Organisms/Header';
import IWallet from 'Entities/IWallet';
import { useErrors } from 'Hooks/errors';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from 'Services/api';

interface IParams {
  id: string;
}

interface IWalletHistory {
  timestamp: string;
  balance: number;
}

const WalletDetails: React.FC = () => {
  const { handleErrors } = useErrors();

  const params = useParams<IParams>();

  const [wallet, setWallet] = useState({} as IWallet);
  const [walletHistory, setWalletHistory] = useState([] as IWalletHistory[]);
  const [loadingFetchWallet, setLoadingFetchWallet] = useState(false);
  const [loadingFetchWalletHistory, setLoadingFetchWalletHistory] =
    useState(true);

  const fetchWallet = useCallback(async () => {
    try {
      setLoadingFetchWallet(true);
      const { id } = params;
      const response = await api.get(`wallets/${id}`);
      setWallet(response.data);
      setLoadingFetchWallet(false);
    } catch (err) {
      handleErrors('Error when fetching wallet data', err);
    }
  }, [params, handleErrors]);

  const fetchWalletHistory = useCallback(async () => {
    try {
      const now = new Date();
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      setLoadingFetchWallet(true);
      const { id } = params;
      const response = await api.get(
        `test/history/?wallet_id=${id}&interval=1d&start=${start.toISOString()}&end=${end.toISOString()}`,
      );
      setWalletHistory(response.data);
      setLoadingFetchWalletHistory(false);
    } catch (err) {
      handleErrors('Error when fetching wallet history data', err);
    }
  }, [params, handleErrors]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  useEffect(() => {
    fetchWalletHistory();
  }, [fetchWalletHistory]);

  return (
    <PageContainer>
      <Header />

      <ContentContainer flexDirection="column" justifyContent="start">
        <Skeleton isLoaded={!loadingFetchWallet}>
          <Heading>{`${wallet.alias} Wallet`}</Heading>
        </Skeleton>

        <Box w="100%" mt="50px">
          <Skeleton
            isLoaded={!loadingFetchWallet && !loadingFetchWalletHistory}
          >
            <AreaChart
              width={730}
              height={250}
              data={walletHistory}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(tick: string) => {
                  const timestamp = new Date(tick);
                  return timestamp.toLocaleDateString();
                }}
              />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </Skeleton>
        </Box>
      </ContentContainer>
    </PageContainer>
  );
};

export default WalletDetails;
