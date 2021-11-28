import React from 'react';

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
  if (!balance) return <></>;

  return (
    <>
      {(balance / dollar_rate).toLocaleString(locales, {
        style,
        currency,
        currencyDisplay,
        maximumFractionDigits,
        ...rest,
      })}
    </>
  );
};

export default Balance;
