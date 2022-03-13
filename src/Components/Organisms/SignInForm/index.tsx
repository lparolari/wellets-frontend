import { FormHandles } from '@unform/core';
import Button from 'Components/Atoms/Button';
import Form from 'Components/Atoms/Form';
import Input from 'Components/Atoms/Input';
import ISignInDTO from 'DTOs/ISignInDTO';
import { useAuth } from 'Hooks/auth';
import { useErrors } from 'Hooks/errors';
import React, { useCallback, useRef, useState } from 'react';
import signInSchema from 'Schemas/signIn';

const SignInForm: React.FC = () => {
  const { signIn } = useAuth();
  const { handleErrors } = useErrors();

  const signInFormRef = useRef<FormHandles>(null);

  const [loadingSignIn, setLoadingSignIn] = useState(false);

  const handleSignIn = useCallback(
    async (data: ISignInDTO) => {
      try {
        if (loadingSignIn) return;
        setLoadingSignIn(true);
        signInFormRef.current?.setErrors({});
        await signInSchema.validate(data, {
          abortEarly: false,
        });
        await signIn(data);
      } catch (err) {
        handleErrors('Error when signing in', err, signInFormRef);
      } finally {
        setLoadingSignIn(false);
      }
    },
    [loadingSignIn, signInFormRef, signIn, handleErrors],
  );

  return (
    <Form ref={signInFormRef} onSubmit={handleSignIn}>
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
      <Button type="submit" isLoading={loadingSignIn} isPrimary>
        Sign In
      </Button>
    </Form>
  );
};

export default SignInForm;
