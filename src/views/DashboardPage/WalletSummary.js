import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Container, Row, Col, Button, Alert} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";

import { withRouter } from "react-router";


import { auth } from "_actions/user_action";

import Header from "components/Header"; 
import WalletInfo from "./WalletInfo";
import FarmingInfo from "./FarmingInfo";

import LineChart from "components/charts/LineChart";
import DoughnutChart from "components/charts/DoughnutChart";

function WalletSummary(props) {

  const [KlayBalance, setKlayBalance] = useState({});
  const [BSCBalance, setBSCBalance] = useState({});
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(auth()).then((res) => {
      if (res.payload) {
        // setUserInfo(res.payload);
        axios.get(`/api/wallets/${res.payload._id}/asset`)
              .then(res => { 
                if (res.status) setKlayBalance(res.data.result);
              });
      }
    });
  }, []);

  return (
    <>
      <div className="container-border">
        <div
          style={{
            height: "2rem",
            display: "flex",
            flexDirection: "row",
            // padding: '5px',
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div
            style={{
              // padding: '5px',
              fontSize: "14px",
              flex: "1",
            }}
          >
            지갑 총액
          </div>
          <div
            style={{
              flex: 2,
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly"
            }}
          >
            <div
              style={{
                margin: "0 0 0 10px",
                padding: "1px 3px",
                fontSize: "12px",
                display: "inline",
                color: "#E64743",
              }}
            >
              ▴ 200.0 %
            </div>
            <div
              style={{
                fontSize: "18px",
                display: "inline",
              }}
            >
              ₩ 10,000,000
            </div>                      
          </div>
        </div>
        <LineChart />
      </div>

      <p style={{ fontSize: "14px" }}>지갑 자산 구성</p>
      <div className="container-border">
        <DoughnutChart />
      </div>

      <p style={{ fontSize: "14px" }}>보유 토큰</p>
      <div>
        {/* {KlayBalance && ( */}
          <WalletInfo balance={KlayBalance} atype="Klaytn" />
        {/* )}
        {BSCBalance &&  */}
          <WalletInfo balance={BSCBalance} atype="BSC" />
        {/* } */}
      </div>
    </>
  );
}

export default withRouter(WalletSummary);