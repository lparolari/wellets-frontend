import {
  Box,
  Button as BaseButton,
  ButtonProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';

interface IProps extends ButtonProps {
  isPrimary?: boolean;
  isDanger?: boolean;
  colorSchema?: string;
  confirmation?: {
    body: string;
    buttonText: string;
    colorSchema: string;
  };
}

const Button: React.FC<IProps> = ({
  isPrimary,
  isDanger,
  colorSchema,
  confirmation,
  onClick,
  ...rest
}) => {
  const color = useMemo(() => {
    if (colorSchema && isPrimary) return colorSchema;
    if (isPrimary) return 'green';
    if (isDanger) return 'red';
    return 'white';
  }, [colorSchema, isPrimary, isDanger]);

  return (
    <Popover>
      <PopoverTrigger>
        <BaseButton
          variant="outline"
          colorScheme={color}
          loadingText="Loading"
          onClick={confirmation ? () => {} : onClick}
          {...rest}
        />
      </PopoverTrigger>
      {confirmation && (
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Box>{confirmation.body}</Box>
              <BaseButton
                mt="10px"
                onClick={onClick}
                colorScheme={confirmation.colorSchema}
              >
                {confirmation.buttonText}
              </BaseButton>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      )}
    </Popover>
  );
};

export default Button;
