import React from 'react';
import { FiGithub } from 'react-icons/fi';

import {
  Box,
  Flex,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';

const Sponsors: React.FC = () => (
  <Box h="100%" w="100%" maxW="400px" bg="green.300" borderStartRadius="5px">
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        flex="1"
      >
        <Heading color="gray.700" size="2xl">
          Wellets
        </Heading>
        <Heading color="gray.700" size="md">
          v1.1
        </Heading>
      </Flex>

      <Box>
        <LinkBox w="100%" h="100%">
          <Flex direction="column" justifyContent="center" alignItems="center">
            <Icon as={FiGithub} height={25} width={25} color="gray.700" />
            <Text color="gray.700" fontWeight="bold">
              <LinkOverlay href="https://github.com/stemDaniel/wellets-frontend">
                GitHub
              </LinkOverlay>
            </Text>
          </Flex>
        </LinkBox>
      </Box>
    </Flex>
  </Box>
);

export default Sponsors;
