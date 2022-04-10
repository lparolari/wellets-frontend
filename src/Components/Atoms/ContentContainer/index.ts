import { chakra, Flex } from '@chakra-ui/react';

const ContentContainer = chakra(Flex, {
  baseStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    flex: '1',
  },
});

export default ContentContainer;
