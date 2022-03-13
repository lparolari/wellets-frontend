import {
  Box,
  Center,
  Heading,
  SlideFade,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import ContentContainer from 'Components/Atoms/ContentContainer';
import PageContainer from 'Components/Atoms/PageContainer';
import Switch from 'Components/Atoms/Switch';
import SignInForm from 'Components/Organisms/SignInForm';
import SignUpForm from 'Components/Organisms/SignUpForm';
import Sponsors from 'Components/Organisms/Sponsors';
import React, { useCallback, useEffect, useState } from 'react';

type IAvailableForms = 'SignIn' | 'SignUp';

const SignIn: React.FC = () => {
  const showSponsors = useBreakpointValue({ base: false, md: true });

  const [showForm, setShowForm] = useState(false);
  const [activeForm, setActiveForm] = useState<IAvailableForms>('SignIn');

  const handleChangeForm = useCallback(
    (form: IAvailableForms) => {
      if (!showForm) return;
      setShowForm(false);
      setTimeout(() => {
        setActiveForm(form);
      }, 100);
    },
    [showForm],
  );

  useEffect(() => {
    setTimeout(() => {
      setShowForm(true);
    }, 500);
  }, [activeForm]);

  return (
    <PageContainer>
      <ContentContainer>
        {showSponsors && <Sponsors />}
        <Box
          w="100%"
          h="100%"
          bg="gray.700"
          position="relative"
          borderEndRadius="5px"
          borderStartRadius={!showSponsors ? '5px' : ''}
        >
          <Switch
            top="20px"
            right="20px"
            position="absolute"
            loading={!showForm}
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
      </ContentContainer>
    </PageContainer>
  );
};

export default SignIn;
