import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Container, Row, Col, Button, Alert} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";

import { withRouter } from "react-router";


import { auth } from "_actions/user_action";

import Header from "components/Header"; 
import PortfolioSubMenu from "components/PortfolioSubMenu";

import StakingInfo from "./StakingInfo";

import LineChart from "components/charts/LineChart";
import DoughnutChart from "components/charts/DoughnutChart";

function StakingSummary(props) {

  const [KlayBalance, setKlayBalance] = useState({});
  const [BSCBalance, setBSCBalance] = useState({});
  const dispatch = useDispatch();

  function AlertInfo() {
    const [show, setShow] = useState(false);
    if (show) {
      return (
        <Alert
          onClose={() => setShow(false)}
          dismissible
          style={{
            backgroundColor: "#F6F6F6",
            position: "absolute",
            left: "50%",
            transform: "translate(-50%)",
            width: "300px",
          }}
        >
          <Alert.Heading style={{ fontSize: "14px" }}>도움말</Alert.Heading>
          <p style={{ fontSize: "12px" }}>
            ‘매수 금액’은 풀에 처음 유동성 공급을 했을 당시 예치한 토큰의 원화
            환산 금액입니다.
          </p>
        </Alert>
      );
    }
    return (
      <Button
        onClick={() => setShow(true)}
        variant="outline-dark"
        style={{
          width: "18px",
          height: "18px",
          padding: "0",
          fontSize: "11px",
          margin: "auto",
          marginLeft: "5px",
          borderRadius: "18px",
        }}
      >
        i
      </Button>
    );
  }

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
      <Header />
      <PortfolioSubMenu menuIndex={3} />
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
              fontSize: "1em",
              flex: "1",
              textAlign: 'left'
            }}
          >
            총 평가 금액
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
              ▴ 4.65 %
            </div>
            <div
              style={{
                fontSize: "18px",
                display: "inline",
              }}
            >
              3,600,000원
            </div>                      
          </div>
        </div>
        <LineChart />
      </div>
      <p style={{ fontSize: "1em", textAlign: 'left' }}>종합 요약</p>
      <div className="container-border">
        <div className="farming-grid">
          <p>총 매수 금액</p> <AlertInfo />
          <p style={{ flex: "1", textAlign: "right" }}> ₩3,600,000</p>
        </div>
        <div className="farming-grid">
          <p>총 평가 금액</p> <AlertInfo />
          <p style={{ flex: "1", textAlign: "right" }}> ₩4,000,000</p>
        </div>
        <div className="farming-grid">
          <p>리워드 합계</p> <AlertInfo />
          <p style={{ flex: "1", textAlign: "right" }}> ₩400,000</p>
        </div>
        <div className="farming-grid">
          <p>수확된 리워드</p> <AlertInfo />
          <p style={{ flex: "1", textAlign: "right" }}> ₩600,000</p>
    </div>
    <div className="farming-grid">
      <p>예상 APR 평균</p> <AlertInfo />
      <p style={{ flex: "1", textAlign: "right" }}> 11.11%</p>
    </div>
    <div className="farming-grid">
      <p>현재 수익륜 평균</p> <AlertInfo />
      <p style={{ flex: "1", textAlign: "right" }}> 11.11%</p>
    </div>
  </div>

  <p style={{ fontSize: "1em", textAlign: 'left' }}>프로토콜별 요약</p>
    {KlayBalance && (
      <StakingInfo balance={KlayBalance} atype="Klaytn" />
    )}
    {BSCBalance && <StakingInfo balance={BSCBalance} atype="BSC" />}
    </>
    
  );
  
}

export default withRouter(StakingSummary);