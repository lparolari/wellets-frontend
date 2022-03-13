import React from 'react';

import { Badge } from '@chakra-ui/react';

import Balance from './Balance';

type IProps = React.ComponentProps<typeof Balance>;

const BalanceBadge: React.FC<IProps> = props => (
  <Badge>
    {'\u2248 '}
    <Balance {...props} />
  </Badge>
);

export default BalanceBadge;
