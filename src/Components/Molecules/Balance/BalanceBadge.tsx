import { Badge } from '@chakra-ui/react';
import React from 'react';

import Balance from './Balance';
import useStyles from './BalanceBadge.styles';

type IProps = React.ComponentProps<typeof Balance>;

const BalanceBadge: React.FC<IProps> = props => {
  const classes = useStyles();
  return (
    <Badge>
      <span className={classes.balanceBadge}>
        {'\u2248 '}
        <Balance {...props} />
      </span>
    </Badge>
  );
};

export default BalanceBadge;
