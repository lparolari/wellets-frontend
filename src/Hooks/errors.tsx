/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {
  MutableRefObject,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { FormHandles } from '@unform/core';
import { ValidationError as YupValidationError } from 'yup';
import { useToast } from '@chakra-ui/react';

interface Errors {
  [key: string]: string;
}

interface IErrorsContext {
  getValidationErrors(err: YupValidationError): Errors;
  handleErrors(
    title: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    formRef?: MutableRefObject<FormHandles | null>,
  ): void;
}

const ErrorsContext = createContext<IErrorsContext>({} as IErrorsContext);

export const ErrorsProvider: React.FC = ({ children }) => {
  const toast = useToast();

  const getValidationErrors = useCallback((err: YupValidationError): Errors => {
    const errors: Errors = {};

    err.inner.forEach(error => {
      if (!error.path) return;
      errors[error.path] = error.message;
    });

    return errors;
  }, []);

  const handleErrors = useCallback(
    (
      title: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      err: any,
      formRef?: MutableRefObject<FormHandles | null>,
    ): void => {
      if (err instanceof YupValidationError && formRef) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      if (err.response) {
        const e = err.response.data;
        let message = '';
        if (e.validation) {
          const celebrate = e.validation;
          if (celebrate.body) message = celebrate.body.message;
          else if (celebrate.query) message = celebrate.query.message;
          else if (celebrate.params) message = celebrate.params.message;
        }
        toast({
          title,
          description: message || e.message || e,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } else {
        toast({
          title: 'An unexpected error has ocurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
    [toast, getValidationErrors],
  );

  const context = useMemo(
    () => ({ getValidationErrors, handleErrors }),
    [getValidationErrors, handleErrors],
  );

  return (
    <ErrorsContext.Provider value={context}>{children}</ErrorsContext.Provider>
  );
};

export const useErrors = (): IErrorsContext => {
  const context = useContext(ErrorsContext);
  if (!context) {
    throw new Error('useErrors must be used within ErrorsProvider');
  }
  return context;
};

export default ErrorsProvider;
