import React, { useRef, useEffect, useState } from 'react';
import { useField } from '@unform/core';
import {
  SelectProps,
  FormControl,
  InputGroup,
  FormLabel,
  InputRightElement,
  FormHelperText,
} from '@chakra-ui/react';
import { Select as BaseSelect } from 'chakra-react-select';

import InputError from '../InputError';

export interface IOption {
  value: string | number;
  label: string;
}

export interface IProps extends SelectProps {
  name: string;
  label?: string;
  helper?: string;
  options: IOption[];
  isMulti?: boolean;
}

const BetterSelect: React.FC<IProps> = ({
  name,
  label,
  helper,
  options,
  isMulti,
  ...rest
}) => {
  const selectRef = useRef(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);
  const [value, setValue] = useState<any>(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue(ref) {
        return ref.state.value;
      },
      clearValue(ref) {
        ref.state.value = null;
        setValue(undefined);
      },
      setValue(ref, newValue: any) {
        ref.state.value = newValue;
        setValue(newValue);
      },
    });
  }, [fieldName, registerField]);

  return (
    <FormControl id={name}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        <div style={{ width: '100%' }}>
          <BaseSelect
            options={options}
            ref={selectRef}
            defaultValue={defaultValue}
            isMulti={isMulti}
            value={value}
            onChange={(newValue: any) => setValue(newValue)}
            isSearchable
            isClearable
            {...rest}
          />
        </div>
        {error && (
          <InputRightElement width="4.5rem">
            <InputError error={error} />
          </InputRightElement>
        )}
      </InputGroup>
      {helper && <FormHelperText>{helper}</FormHelperText>}
    </FormControl>
  );
};

export default BetterSelect;
