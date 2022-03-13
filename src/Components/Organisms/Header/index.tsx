import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { SyncCurrenciesButton } from 'Components/Molecules/SyncCurrenciesButton/SyncCurrenciesButton';
import { useAuth } from 'Hooks/auth';
import React from 'react';
import { FiMenu, FiUser, FiX } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import NavLink from '../../Atoms/NavLink/NavLink';
import Links from '../../Molecules/HeaderLinks/HeaderLinks';

interface IProps {
  color?: string;
}

const Header: React.FC<IProps> = ({ color }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { signOut } = useAuth();
  const history = useHistory();

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <Icon as={FiX} /> : <Icon as={FiMenu} />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems="center">
          <NavLink to="/">
            <strong>Wellets</strong>
          </NavLink>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Links color={color} location={history.location} />
          </HStack>
        </HStack>
        <Flex alignItems="center">
          <SyncCurrenciesButton />
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <Avatar size="sm" icon={<Icon as={FiUser} />} />
            </MenuButton>
            <MenuList>
              <MenuItem isDisabled>Profile</MenuItem>
              <MenuItem onClick={() => history.push('/settings')}>
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={signOut}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            <Links />
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Header;
