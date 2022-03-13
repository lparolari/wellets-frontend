import {
  Radio as BaseRadio,
  RadioGroup,
  RadioProps,
  Stack,
  StackDirection,
} from '@chakra-ui/react';
import { useField } from '@unform/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, registerField, defaultValue = '', error } = useField(name);

  const [value, setValue] = useState<string>(defaultValue);

  const onChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (inputRef.current) {
        inputRef.current.value = newValue;
      }
    },
    [inputRef],
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      clearValue(ref) {
        ref.value = '';
        setValue('');
      },
      setValue(ref, newValue: string) {
        ref.value = newValue;
        setValue(newValue);
      },
    });
  }, [fieldName, registerField, inputRef]);

  return (
    <RadioGroup onChange={onChange} value={value}>
      <Stack direction={direction || 'row'}>
        {options.map(option => (
          <BaseRadio key={option.id} value={option.value} {...rest}>
            {option.label}
          </BaseRadio>
        ))}
        {error && <InputError error={error} />}
      </Stack>
      <input type="hidden" name={name} ref={inputRef} />
    </RadioGroup>
  );
};

export default Radio;
