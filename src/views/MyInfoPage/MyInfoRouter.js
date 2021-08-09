import React from "react"; 
import { Route, Switch } from "react-router-dom"; 


import MyInfoPage from "views/MyInfoPage/MyInfoPage";
import MyWalletPage from "views/MyInfoPage/MyWalletPage";

import WalletAddMainPage from "views/MyInfoPage/WalletAdd/WalletAddMainPage";
import WalletImportPage from "views/MyInfoPage/WalletAdd/WalletImportPage";
import WalletCreatePage from "views/MyInfoPage/WalletAdd/WalletCreatePage";

import Auth from "../../hoc/auth"; 

const MyInfoRouter = () => {
  const basePath = "/myinfo";
  return (
    <Switch>
      <Route path={`${basePath}/`} exact component={Auth(MyInfoPage, true)} />
      <Route path={`${basePath}/wallet`} exact component={Auth(MyWalletPage, true)} />
      <Route path={`${basePath}/wallet/new`} component={Auth(WalletAddMainPage, true)} />
      <Route path={`${basePath}/wallet/import`} component={Auth(WalletImportPage, true)} />
      <Route path={`${basePath}/wallet/create`} component={Auth(WalletCreatePage, true)} />
    </Switch>
  );
};

export default MyInfoRouter; 