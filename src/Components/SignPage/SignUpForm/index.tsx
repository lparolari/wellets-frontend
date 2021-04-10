import React, { useRef, useState, useCallback } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Stack, Button } from '@chakra-ui/react';
import { toast } from 'react-toastify';

import Input from 'Components/Input';

import signUpSchema from 'Schemas/signUp';
import handleErrors from 'Helpers/handleErrors';
import api from 'Services/api';

interface ISignUpFormData {
  email: string;
  password: string;
  confirm_password?: string;
}

interface IProps {
  onSuccess: () => void;
}

const SignUpForm: React.FC<IProps> = ({ onSuccess }) => {
  const signUpFormRef = useRef<FormHandles>(null);

  const [loadingSignUp, setLoadingSignUp] = useState(false);

  const handleSignUp = useCallback(
    async (data: ISignUpFormData) => {
      try {
        if (loadingSignUp) return;
        setLoadingSignUp(true);
        signUpFormRef.current?.setErrors({});
        await signUpSchema.validate(data, {
          abortEarly: false,
        });
        delete data.confirm_password;
        await api.post('/users/signup', data);
        toast.success('Your account was successfully created!');
        onSuccess();
      } catch (err) {
        handleErrors(err, signUpFormRef);
      } finally {
        setLoadingSignUp(false);
      }
    },
    [loadingSignUp, signUpFormRef, onSuccess],
  );

  return (
    <Form ref={signUpFormRef} onSubmit={handleSignUp}>
      <Stack spacing="40px">
        <Input
          name="email"
          type="email"
          placeholder="Enter your e-mail"
          helper="We'll never share your email."
        />
        <Input
          name="password"
          type="password"
          placeholder="Enter your password"
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="Confirm your password"
        />
        <Button
          type="submit"
          variant="outline"
          colorScheme="green"
          loadingText="Loading"
          isLoading={loadingSignUp}
        >
          Sign Up
        </Button>
      </Stack>
    </Form>
  );
};

export default SignUpForm;