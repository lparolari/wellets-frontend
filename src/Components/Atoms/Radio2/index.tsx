import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Stack,
  RadioGroup,
  Radio as BaseRadio,
  StackDirection,
  RadioProps,
} from '@chakra-ui/react';
import InputError from '../InputError';
import { useField } from 'formik';

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
  const [field, meta, helpers] = useField(name);
  
  const { onChange } = field;
  const { value, error, touched } = meta;
  const { setValue } = helpers;

  return (
    <RadioGroup onChange={(v) => setValue(v)} value={value} name={name}>
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
