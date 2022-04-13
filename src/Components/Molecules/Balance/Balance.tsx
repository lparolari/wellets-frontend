import formatBalance from 'Helpers/formatBalance';
import React from 'react';

import useStyles from './Balance.styles';

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
  const classes = useStyles();

  if (!balance && balance !== 0) return null;

  const finalBalance = balance / dollar_rate;

  try {
    return (
      <span className={classes.balance}>
        {formatBalance(finalBalance, locales, {
          style,
          currency,
          currencyDisplay,
          maximumFractionDigits,
          ...rest,
        })}
      </span>
    );
  } catch (e) {
    return (
      <span className={classes.balance}>
        `${currency} ${finalBalance.toFixed(maximumFractionDigits)}`
      </span>
    );
  }
};

export default Balance;
