import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input as BaseInput,
  InputGroup,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useMemo, useState } from 'react';

import InputError from '../InputError';

interface IProps extends InputProps {
  name: string;
  label?: string;
  helper?: string;
  rightElement?: React.ReactNode;
}

const Input: React.FC<IProps> = ({
  name,
  label,
  helper,
  type,
  rightElement,
  ...rest
}) => {
  // Custom hooks
  const [field, meta, helpers] = useField(name);

  const { onChange } = field;
  const { value, initialValue, error, touched } = meta;
  const { setTouched } = helpers;

  // States
  const [showPassword, setShowPassword] = useState(false);

  // Memos
  const inputType = useMemo(() => {
    if (type === 'password' && showPassword) return 'text';
    if (type === 'password' && !showPassword) return 'password';
    return type;
  }, [type, showPassword]);

  return (
    <FormControl id={name}>
      <InputGroup>
        {label && <FormLabel>{label}</FormLabel>}
        <BaseInput
          variant="flushed"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => setTouched(true)}
          type={inputType}
          defaultValue={initialValue}
          step={type === 'number' ? '0.000000000000001' : ''}
          {...rest}
        />
        {!error && rightElement}
        {type === 'password' && error && touched && (
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              mr="5px"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Button>
            <InputError error={error} />
          </InputRightElement>
        )}
        {type === 'password' && !error && (
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        )}
        {type !== 'password' && error && touched && (
          <InputRightElement width="4.5rem">
            <InputError error={error} />
          </InputRightElement>
        )}
      </InputGroup>

      {helper && <FormHelperText>{helper}</FormHelperText>}
    </FormControl>
  );
};

export default Input;
