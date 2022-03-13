import { Button, useToast } from '@chakra-ui/react';
import { FormHandles } from '@unform/core';
import Form from 'Components/Atoms/Form';
import Input from 'Components/Atoms/Input';
import ISignUpDTO from 'DTOs/ISignUpDTO';
import { useErrors } from 'Hooks/errors';
import React, { useCallback, useRef, useState } from 'react';
import signUpSchema from 'Schemas/signUp';
import api from 'Services/api';

interface IProps {
  onSuccess: () => void;
}

const SignUpForm: React.FC<IProps> = ({ onSuccess }) => {
  const toast = useToast();
  const { handleErrors } = useErrors();

  const signUpFormRef = useRef<FormHandles>(null);

  const [loadingSignUp, setLoadingSignUp] = useState(false);

  const handleSignUp = useCallback(
    async (data: ISignUpDTO) => {
      try {
        if (loadingSignUp) return;
        setLoadingSignUp(true);
        signUpFormRef.current?.setErrors({});
        await signUpSchema.validate(data, {
          abortEarly: false,
        });
        delete data.confirm_password;
        await api.post('/users', data);
        toast({
          title: 'Your account has been successfully created!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        onSuccess();
      } catch (err) {
        handleErrors('Error when signing up', err, signUpFormRef);
      } finally {
        setLoadingSignUp(false);
      }
    },
    [loadingSignUp, signUpFormRef, onSuccess, handleErrors, toast],
  );

  return (
    <Form ref={signUpFormRef} onSubmit={handleSignUp}>
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
    </Form>
  );
};

export default SignUpForm;
