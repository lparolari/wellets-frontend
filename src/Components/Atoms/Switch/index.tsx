import { Box, BoxProps } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import { LeftButton, RightButton } from './styles';

type IButton = 'left' | 'right';

interface ISwitchProps extends Omit<BoxProps, 'onChange'> {
  loading?: boolean;
  leftText: string;
  rightText: string;
  defaultActive?: IButton;
  onChange: (_active: IButton) => void;
}

const Switch: React.FC<ISwitchProps> = ({
  loading,
  leftText,
  rightText,
  defaultActive,
  onChange,
  ...rest
}) => {
  const [active, setActive] = useState(defaultActive || 'left');

  const handleClick = useCallback(
    (newActive: IButton) => {
      if (loading || active === newActive) return;
      setActive(newActive);
      if (onChange) {
        onChange(newActive);
      }
    },
    [onChange, loading, active],
  );

  return (
    <Box {...rest}>
      <LeftButton
        active={active === 'left'}
        onClick={() => handleClick('left')}
      >
        {leftText}
      </LeftButton>
      <RightButton
        active={active === 'right'}
        onClick={() => handleClick('right')}
      >
        {rightText}
      </RightButton>
    </Box>
  );
};

export default Switch;
