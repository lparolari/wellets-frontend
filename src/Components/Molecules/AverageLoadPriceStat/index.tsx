import { Skeleton, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import ICurrency from 'Entities/ICurrency';
import { changeFrom2 } from 'Helpers/converter';
import React from 'react';

import Balance from '../Balance/Balance';
import { useFetchStatistics } from './useFetchStatistics';

type AverageLoadPriceStatProps = {
  walletId: string;
  baseCurrency: ICurrency;
};

const AverageLoadPriceStat = ({
  walletId,
  baseCurrency,
}: AverageLoadPriceStatProps) => {
  const { statistics, isFetching } = useFetchStatistics(walletId);

  return (
    <Stat>
      <StatLabel>Average load price</StatLabel>
      <Skeleton isLoaded={!isFetching} height="2rem">
        <StatNumber>
          {statistics && (
            <Balance
              balance={statistics.average_load_price}
              dollar_rate={changeFrom2(
                statistics.base_currency.dollar_rate,
                baseCurrency.dollar_rate,
              )}
              currency={baseCurrency.acronym}
            />
          )}
        </StatNumber>
      </Skeleton>
    </Stat>
  );
};

export default AverageLoadPriceStat;
