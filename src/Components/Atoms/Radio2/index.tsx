import {
  Radio as BaseRadio,
  RadioGroup,
  RadioProps,
  Stack,
  StackDirection,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

import InputError from '../InputError';

interface IProps {
  name: string;
  options: {
    id: string;
    value: string;
    label: string;
  }[];
  direction?: StackDirection;
}

type IRadioProps = RadioProps & IProps;

const Radio: React.FC<IRadioProps> = ({
  name,
  options,
  direction,
  ...rest
}) => {
  const [_field, meta, helpers] = useField(name);

  const { value, error, touched } = meta;
  const { setValue } = helpers;

  return (
    <RadioGroup onChange={v => setValue(v)} value={value} name={name}>
      <Stack direction={direction || 'row'}>
        {options.map(option => (
          <BaseRadio key={option.id} value={option.value} {...rest}>
            {option.label}
          </BaseRadio>
        ))}
        {error && touched && <InputError error={error} />}
      </Stack>
    </RadioGroup>
  );
};

export default Radio;
