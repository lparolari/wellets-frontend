import { Button as ChakraButton } from '@chakra-ui/react';
import styled, { css } from 'styled-components';

interface IProps {
  active?: boolean;
}

export const DefaultButton = styled(ChakraButton)<IProps>`
  ${props =>
    props.active &&
    css`
      background-color: #68d391;
    `}

  &:hover {
    ${props =>
      props.active &&
      css`
        background-color: #68d391;
      `}
  }

  &:focus {
    box-shadow: none;
  }
`;

export const LeftButton = styled(DefaultButton)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;

export const RightButton = styled(DefaultButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;
