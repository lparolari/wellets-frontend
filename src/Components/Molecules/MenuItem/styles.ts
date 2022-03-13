import { Box } from '@chakra-ui/react';
import styled, { css } from 'styled-components';

interface IProps {
  borderColor: string;
}

export const Container = styled(Box)<IProps>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  transition: all 0.1s linear;
  cursor: pointer;

  &:hover {
    border: 5px solid;
    ${({ borderColor }) =>
      css`
        border-color: ${borderColor};
      `}
  }
`;
