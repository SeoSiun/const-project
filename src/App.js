import React from "react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import "./App.css";

import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import ReducThunk from "redux-thunk";
import Reducer from "./_reducers";

import SplashPage from "views/SplashPage/SplashPage";
import SignupPage from "views/SignupPage/SignupPage";
import SigninPage from "views/SigninPage/SigninPage";
import ResetpasswordPage from "views/ResetpasswordPage/ResetpasswordPage";

import DashboardPage from "views/DashboardPage/DashboardPage";
// import MyInfoPage from "views/MyInfoPage/MyInfoPage";
// import MyWalletPage from "views/MyInfoPage/MyWalletPage";

import MyInfoRouter from "views/MyInfoPage/MyInfoRouter"; 

import FarmingDetailInfo from "views/DashboardPage/FarmingDetailInfo";
import StakingDetailInfo from "views/DashboardPage/StakingDetailInfo";
import PortfolioMain from "views/DashboardPage/PortfolioMain";
import WalletSummary from "views/DashboardPage/WalletSummary";
import FarmingSummary from "views/DashboardPage/FarmingSummary";
import StakingSummary from "views/DashboardPage/StakingSummary";

// import WalletAddMainPage from "views/MyInfoPage/WalletAdd/WalletAddMainPage";
// import WalletImportPage from "views/MyInfoPage/WalletAdd/WalletImportPage";
// import WalletCreatePage from "views/MyInfoPage/WalletAdd/WalletCreatePage";

import Auth from "./hoc/auth";

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReducThunk
)(createStore);

// const MyInfoRouter = () => {
//   const basePath = "/myinfo";
//   return (
//     <Switch>
//       <Route path={`${basePath}/`} exact component={Auth(MyInfoPage, true)} />
//       <Route path={`${basePath}/wallet`} component={Auth(MyWalletPage, true)} />
//       {/* <Route path={`${basePath}/wallet/new`} component={Auth(WalletAddMainPage, true)} />
//       <Route path={`${basePath}/wallet/import`} component={Auth(WalletImportPage, true)} />
//       <Route path={`${basePath}/wallet/create`} component={Auth(WalletCreatePage, true)} /> */}
//     </Switch>
//   );
// };

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider
        store={createStoreWithMiddleware(
          Reducer,
          window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
        )}
      >
        <div
          className="App justify-content-center"
          style={{ padding: "0", margin: "0 auto", maxWidth: "900px" }}
        >
          <Container fluid="md">
            <Switch>
              <Route exact path="/" component={Auth(SplashPage, false)} />
              <Route path="/signup" component={Auth(SignupPage, false)} />
              <Route path="/signin" component={Auth(SigninPage, false)} />
              <Route path="/resetpassword" component={Auth(ResetpasswordPage, false)} />

              <Route
                path="/FarmingDetailInfo"
                component={Auth(FarmingDetailInfo, true)}
              />
              <Route
                path="/StakingDetailInfo"
                component={Auth(StakingDetailInfo, true)}
              />

              <Route exact path="/portfolio" component={Auth(PortfolioMain, true)} />
              <Route path="/portfolio/summary" component={Auth(DashboardPage, true)} />
              <Route path="/portfolio/wallet" component={Auth(WalletSummary, true)} />
              <Route path="/portfolio/farming" component={Auth(FarmingSummary, true)} />

              <Route path="/portfolio/staking" component={Auth(StakingSummary, true)} />
              
              <MyInfoRouter />
              {/* <Route exact path="/myinfo" component={Auth(MyInfoPage, true)} />
              <Route
                exact
                path="/myinfo/wallet"
                component={Auth(MyWalletPage, true)}
              /> */}
              {/* <Route
                exact
                path="/myinfo/loginsetting"
                component={Auth(LoginSetupPage, true)}
              /> */}

              {/* <Route
                exact
                path="/myinfo/wallet/new"
                component={Auth(WalletAddMainPage, true)}
              />
              <Route
                exact
                path="/myinfo/wallet/import"
                component={Auth(WalletImportPage, true)}
              />
              <Route
                exact
                path="/myinfo/wallet/create"
                component={Auth(WalletCreatePage, true)}
              /> */}
            </Switch>
          </Container>
        </div>
      </Provider>
    );
  }
}

export default App;
