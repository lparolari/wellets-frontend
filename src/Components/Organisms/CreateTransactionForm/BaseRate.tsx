import BalanceBadge from 'Components/Molecules/Balance/BalanceBadge';
import ICurrency from 'Entities/ICurrency';
import { useField } from 'formik';
import React from 'react';

import { Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react';
import InputError from 'Components/Atoms/InputError';

const BaseRate = ({
  name,
  baseCurrency,
  targetCurrency,
}: {
  name: string;
  baseCurrency: ICurrency;
  targetCurrency: ICurrency;
}) => {
  const [field, meta, helpers] = useField(name);

  const { onChange } = field;
  const { value, initialValue, error, touched } = meta;
  const { setTouched } = helpers;

  return (
    <Stack direction="row">
      <InputGroup>
        <Input
          variant="flushed"
          name={name}
          type="number"
          value={value}
          onChange={onChange}
          onBlur={() => setTouched(true)}
          defaultValue={initialValue}
          placeholder={`${baseCurrency.alias} rate (empty means current rate)`}
          helper={`1 ${targetCurrency.acronym} equivalent to ? ${baseCurrency.acronym}`}
        />
        {error && touched && (
          <InputRightElement width="4.5rem">
            <InputError error={error} />
          </InputRightElement>
        )}
        {!error && value && (
          <InputRightElement width="6.5rem">
            {value && (
              <BalanceBadge
                balance={1}
                dollar_rate={1 / (value / baseCurrency.dollar_rate)}
              />
            )}
          </InputRightElement>
        )}
      </InputGroup>
    </Stack>
  );
};

export default BaseRate;
