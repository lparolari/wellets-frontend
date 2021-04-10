import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Stack,
  Center,
  Heading,
  SlideFade,
  useBreakpointValue,
} from '@chakra-ui/react';

import Switch from 'Components/Atoms/Switch';
import Sponsors from 'Components/Organisms/Sponsors';
import SignInForm from 'Components/Organisms/SignInForm';
import SignUpForm from 'Components/Organisms/SignUpForm';

type IAvailableForms = 'SignIn' | 'SignUp';

const SignIn: React.FC = () => {
  const showSponsors = useBreakpointValue({ base: false, md: true });

  const [showForm, setShowForm] = useState(false);
  const [activeForm, setActiveForm] = useState<IAvailableForms>('SignIn');

  const handleChangeForm = useCallback((form: IAvailableForms) => {
    setShowForm(false);
    setTimeout(() => {
      setActiveForm(form);
    }, 100);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowForm(true);
    }, 500);
  }, [activeForm]);

  return (
    <Box h="100vh" p="25px">
      <Flex h="100%">
        {showSponsors && <Sponsors />}
        <Box
          w="100%"
          bg="gray.700"
          position="relative"
          borderEndRadius="5px"
          borderStartRadius={!showSponsors ? '5px' : ''}
        >
          <Switch
            position="absolute"
            top="20px"
            right="20px"
            leftText="Sign In"
            rightText="Sign Up"
            onChange={active =>
              handleChangeForm(active === 'left' ? 'SignIn' : 'SignUp')
            }
          />
          <Center h="100%">
            <Stack spacing="40px" w="100%" maxW="400px" p="20px">
              <SlideFade in={showForm}>
                <Heading color="green.300" textAlign="center">
                  {activeForm === 'SignIn' ? 'Sign In' : 'Sign Up'}
                </Heading>
              </SlideFade>
              <SlideFade in={showForm}>
                {activeForm === 'SignIn' ? (
                  <SignInForm />
                ) : (
                  <SignUpForm onSuccess={() => handleChangeForm('SignIn')} />
                )}
              </SlideFade>
            </Stack>
          </Center>
        </Box>
      </Flex>
    </Box>
  );
};

export default SignIn;
