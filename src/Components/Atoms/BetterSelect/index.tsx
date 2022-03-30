/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputRightElement,
  SelectProps,
} from '@chakra-ui/react';
import { useField } from '@unform/core';
import { Select as BaseSelect } from 'chakra-react-select';
import React, { useEffect, useRef, useState } from 'react';

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

const BetterSelect: React.FC<any> = ({
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
      getValue: (ref: any) =>
        isMulti ? ref.state.selectValue : ref.state.selectValue[0],
      clearValue: (ref: any) => {
        ref.state.selectValue = [];
        setValue([]);
      },
      setValue: (ref: any, newValue: any) => {
        if (isMulti) {
          ref.state.selectValue = newValue;
          setValue(newValue);
        } else {
          ref.state.selectValue = newValue ? [newValue] : [];
          setValue(newValue ? [newValue] : []);
        }
      },
    });
  }, [fieldName, registerField, isMulti]);

  return (
    <FormControl id={name}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        <div style={{ width: '100%' }}>
          <BaseSelect<IOption>
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
