import { Link, useColorModeValue } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { Link as RRDLink } from 'react-router-dom';

interface IProps {
  to: string;
  location?: { pathname: string };
  color?: string;
  children: ReactNode;
}

const NavLink: React.FC<IProps> = ({ to, location, color, children }) => {
  const rootPathname =
    location?.pathname && `/${location?.pathname.split('/')[1]}`;

  return (
    <Link
      as={RRDLink}
      to={to}
      px={2}
      py={1}
      rounded="md"
      aria-current={rootPathname === to ? 'page' : undefined}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      _activeLink={{
        textDecoration: 'none',
        bg: useColorModeValue(
          `${color || 'gray'}.300`,
          `${color || 'gray'}.700`,
        ),
      }}
    >
      {children}
    </Link>
  );
};

export default NavLink;
