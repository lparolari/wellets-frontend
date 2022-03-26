import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input as BaseInput,
  InputGroup,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

import InputError from '../InputError';

interface IProps extends InputProps {
  name: string;
  label?: string;
  helper?: string;
}

const DateTimeInput: React.FC<IProps> = ({ name, label, helper, ...rest }) => {
  // Custom hooks
  const [field, meta, helpers] = useField(name);

  const { onChange } = field;
  const { value, error, touched } = meta;
  const { setTouched } = helpers;

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
          type="datetime-local"
          {...rest}
        />
        {error && touched && (
          <InputRightElement width="4.5rem">
            <InputError error={error} />
          </InputRightElement>
        )}
      </InputGroup>

      {helper && <FormHelperText>{helper}</FormHelperText>}
    </FormControl>
  );
};

export default DateTimeInput;
