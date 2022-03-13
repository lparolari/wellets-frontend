import Route from 'Components/Atoms/Route';
import Currencies from 'Pages/Currencies';
import Menu from 'Pages/Menu';
import Portfolio from 'Pages/Portfolio';
import Rebalance from 'Pages/Rebalance';
import Settings from 'Pages/Settings';
import Sign from 'Pages/Sign';
import Wallet from 'Pages/Wallet';
import WalletDetails from 'Pages/WalletDetails';
import Wallets from 'Pages/Wallets';
import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Sign} />

    <Route path="/menu" component={Menu} isPrivate />
    <Route path="/settings" component={Settings} isPrivate />

    <Route exact path="/wallets" component={Wallets} isPrivate />
    <Route path="/wallets/:id/details" component={WalletDetails} isPrivate />
    <Route path="/wallets/:id" component={Wallet} isPrivate />

    <Route path="/currencies" component={Currencies} isPrivate />

    <Route
      path="/portfolios/:id/rebalance"
      component={Rebalance}
      isPrivate
      exact
    />
    <Route path="/portfolios/:parent_id?" component={Portfolio} isPrivate />

    <Redirect from="*" to="/" />
  </Switch>
);

export default Routes;
