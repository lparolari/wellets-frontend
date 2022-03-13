import { InputGroup, InputRightElement, Stack } from '@chakra-ui/react';
import Input from 'Components/Atoms/Input2';
import BalanceBadge from 'Components/Molecules/Balance/BalanceBadge';
import ICurrency from 'Entities/ICurrency';
import { useField } from 'formik';
import React from 'react';

const BaseRate = ({
  name,
  baseCurrency,
  targetCurrency,
}: {
  name: string;
  baseCurrency: ICurrency;
  targetCurrency: ICurrency;
}) => {
  const [_field, meta, _helpers] = useField(name);

  const { value, initialValue } = meta;

  return (
    <Stack direction="row">
      <InputGroup>
        <Input
          name={name}
          type="number"
          defaultValue={initialValue}
          placeholder={`${baseCurrency.alias} rate (empty means current rate)`}
          helper={`1 ${targetCurrency.acronym} equivalent to ? ${baseCurrency.acronym}`}
          rightElement={
            value && (
              <InputRightElement width="6.5rem">
                {value && (
                  <BalanceBadge
                    balance={1}
                    dollar_rate={1 / (value / baseCurrency.dollar_rate)}
                  />
                )}
              </InputRightElement>
            )
          }
        />
      </InputGroup>
    </Stack>
  );
};

export default BaseRate;
