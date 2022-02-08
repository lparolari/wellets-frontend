import React from 'react';

import NavLink from '../../Atoms/NavLink/NavLink';

interface IProps {
  color?: string;
  location?: { pathname: string };
}

const HeaderLinks: React.FC<IProps> = props => (
  <>
    <NavLink to="/portfolios" {...props}>
      Portfolios
    </NavLink>
    <NavLink to="/wallets" {...props}>
      Wallets
    </NavLink>
    <NavLink to="/currencies" {...props}>
      Currencies
    </NavLink>
  </>
);

export default HeaderLinks;
