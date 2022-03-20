import ChangeRate from 'Components/Atoms/ChangeRate';
import ICurrency from 'Entities/ICurrency';
import { useField } from 'formik';
import React from 'react';

const ChangeRateField = ({
  name,
  baseCurrency,
  targetCurrency,
}: {
  name: string;
  baseCurrency: ICurrency;
  targetCurrency: ICurrency;
}) => {
  const [_field, _meta, helpers] = useField(name);

  const { setValue } = helpers;

  return (
    <ChangeRate
      baseCurrency={baseCurrency}
      targetCurrency={targetCurrency}
      onSuccess={(changeRate: number) => setValue(changeRate)}
    />
  );
};

export default ChangeRateField;
