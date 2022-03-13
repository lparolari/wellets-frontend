import {
  Heading,
  Stack,
  StackDirection,
  useBreakpointValue,
} from '@chakra-ui/react';
import ContentContainer from 'Components/Atoms/ContentContainer';
import PageContainer from 'Components/Atoms/PageContainer';
import Header from 'Components/Organisms/Header';
import UserSettingsForm from 'Components/Organisms/UserSettingsForm';
import React from 'react';

const Settings: React.FC = () => {
  const stack = useBreakpointValue({
    base: {
      direction: 'column' as StackDirection,
    },
    lg: {
      direction: 'row' as StackDirection,
    },
  });

  return (
    <PageContainer>
      <Header />

      <ContentContainer flexDirection="column" justifyContent="start">
        <Heading>Settings</Heading>

        <Stack
          mt="50px"
          direction={stack?.direction}
          spacing="25px"
          maxWidth="480px"
        >
          <UserSettingsForm />
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
};

export default Settings;
