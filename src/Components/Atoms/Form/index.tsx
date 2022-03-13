import React, { Ref } from 'react';
import { Form as BaseForm } from '@unform/web';
import { FormProps, FormHandles } from '@unform/core';
import { Stack, Heading } from '@chakra-ui/react';

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
