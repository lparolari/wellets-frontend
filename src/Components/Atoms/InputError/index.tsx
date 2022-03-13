import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';

interface IProps {
  error: string;
}

const InputError: React.FC<IProps> = ({ error }) => (
  <Tooltip label={error} bg="red.500" color="white" hasArrow>
    <span>
      <FiAlertCircle color="#E53E3E" size={20} />
    </span>
  </Tooltip>
);

export default InputError;
