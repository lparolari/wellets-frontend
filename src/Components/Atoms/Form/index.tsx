import { Heading, Stack } from '@chakra-ui/react';
import { FormHandles, FormProps } from '@unform/core';
import { Form as BaseForm } from '@unform/web';
import React, { Ref } from 'react';

interface IProps extends Omit<FormProps, 'ref'> {
  ref?: Ref<FormHandles>;
  title?: string;
}

const Form: React.FC<IProps> = React.forwardRef(
  ({ title, children, ...rest }, ref) => (
    <BaseForm ref={ref} {...rest}>
      <Stack spacing="40px">
        {title && <Heading size="md">{title}</Heading>}
        {children}
      </Stack>
    </BaseForm>
  ),
);

export default Form;
