import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import Route from 'Components/Atoms/Route';

import Sign from 'Pages/Sign';
import Menu from 'Pages/Menu';
import Wallets from 'Pages/Wallets';
import Wallet from 'Pages/Wallet';
import Currencies from 'Pages/Currencies';
import Settings from 'Pages/Settings';
import Portfolio from 'Pages/Portfolio';
import Rebalance from 'Pages/Rebalance';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Sign} />

      <Route path="/menu" component={Menu} isPrivate />
      <Route path="/settings" component={Settings} isPrivate />

      <Route exact path="/wallets" component={Wallets} isPrivate />
      <Route path="/wallets/:id" component={Wallet} isPrivate />

      <Route path="/currencies" component={Currencies} isPrivate />

      <Route path="/portfolios/:parent_id?" component={Portfolio} isPrivate />
      <Route path="/portfolios/:id/rebalance" component={Rebalance} isPrivate />

      <Redirect from="*" to="/" />
    </Switch>
  );
};

export default Routes;
