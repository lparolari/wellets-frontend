import React, { Fragment } from 'react';

import formatBalance from 'Helpers/formatBalance';

type IProps = {
  balance?: number;
  dollar_rate?: number;
  locales?: string | string[];
} & Intl.NumberFormatOptions;

const Balance: React.FC<IProps> = ({
  balance,
  locales,
  dollar_rate = 1,
  style = 'currency',
  currency = 'USD',
  currencyDisplay = 'code',
  maximumFractionDigits = 2,
  ...rest
}) => {
  if (!balance && balance !== 0) return null;

  const finalBalance = balance / dollar_rate;

  try {
    return (
      <>
        {formatBalance(finalBalance, locales, {
          style,
          currency,
          currencyDisplay,
          maximumFractionDigits,
          ...rest,
        })}
      </>
    );
  } catch (e) {
    return (
      <>
        `${currency} ${finalBalance.toFixed(maximumFractionDigits)}`
      </>
    );
  }
};

export default Balance;
