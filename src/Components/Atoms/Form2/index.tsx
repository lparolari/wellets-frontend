import { Heading, Stack } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import React from 'react';

interface IProps {
  title?: string;
}

const Form: React.FC<IProps> = ({ title, children }) => {
  const { handleSubmit } = useFormikContext();

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="40px">
        {title && <Heading size="md">{title}</Heading>}
        {children}
      </Stack>
    </form>
  );
};

export default Form;
