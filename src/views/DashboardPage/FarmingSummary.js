import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Container, Row, Col, Button, Alert} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";

import { withRouter } from "react-router";


import { auth } from "_actions/user_action";

import Header from "components/Header"; 
import PortfolioSubMenu from "components/PortfolioSubMenu";

import FarmingInfo from "./FarmingInfo";

import LineChart from "components/charts/LineChart";
import DoughnutChart from "components/charts/DoughnutChart";

function StakingSummary(props) {

  const [KlayBalance, setKlayBalance] = useState({});
  const [BSCBalance, setBSCBalance] = useState({});
  const dispatch = useDispatch();

  const helpMsgs = [
    { type: "총 매수 금액", description: "'매수 금액'은 풀에 처음 유동성 공급을 했을 당시 예치한 토큰의 원화 환산 금액입니다." },
    { type: "총 평가 금액", description: "'평가 금액'은 예치한 토큰의 현재 원화 환산 가치입니다." },
    { type: "리워드 합계", description: "'리워드'는 현재 수확할 수 있는 리워드를 말합니다. 쌓인 리워드를 수확할 경우 숫자가 초기화 되어 0부터 재시작 합니다." },
    { type: "누적된 리워드", description: "'누적된 리워드' 는 풀에 처음 유동성 공급을 한 이후부터 현재까지 이미 수확이 끝난 리워드와 현재의 리워드 합계를 합한 총량의 총량입니다. \n *블록 추적 상황에 따라 부정확할 수 있습니다. 참고 용도로만 사용해주세요." },
    { type: "예상 APR 평균", description: "'예상 APR'은 해당 프로토콜에서 풀에 표기한 연간 이율입니다." },
    { type: "현재 수익률 평균", description: "'현재 수익률'은 해당 풀에 처음 예치한 이후 발생한 이익을 백분율로 표시한 수치입니다. 예치한 토큰의 가치 변동에 따라 수시로 변화합니다." },
    { type: "현재 APR 평균", description: "'현재 APR'은 현재 수익률을 365일로 환산한 수치입니다. 예치한 토큰의 가치 변동에 따라 수시로 변화합니다." },
  ];

  function AlertInfo(nTh) {
    console.log(nTh.index);
    const [show, setShow] = useState(false);
    if (show) {
      return (
        <>
          <Alert
            onClose={() => setShow(false)}
            dismissible
            style={{
              backgroundColor: "#F6F6F6",
              position: "absolute",
              left: "50%",
              transform: "translate(-50%)",
              width: "300px",
              zIndex: "2"
            }}
          >
            <Alert.Heading style={{ fontSize: "14px" }}>도움말</Alert.Heading>
            <p style={{ fontSize: "12px", whiteSpace: "pre-wrap", textAlign: "start" }}>
              { helpMsgs[nTh.index].description }
            </p>
          </Alert>
          <div style={{
            position: "fixed", 
            overflowX: "hidden",
            overflowY: "auto",
            top: "0", 
            left: "0", 
            width: "100vw", 
            height: "100vh", 
            backgroundColor: "rgba(0, 0, 0, 0.6)", 
            zIndex: "1" 
          }}> </div>
        </>
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
      <PortfolioSubMenu menuIndex={2} />
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
            총 예치 금액
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
          <p>총 매수 금액</p> <AlertInfo index={0} />
          <p style={{ flex: "1", textAlign: "right" }}> ₩3,600,000</p>
        </div>
        <div className="farming-grid">
          <p>총 평가 금액</p> <AlertInfo index={1} />
          <p style={{ flex: "1", textAlign: "right" }}> ₩4,000,000</p>
        </div>
        <div className="farming-grid">
          <p>리워드 합계</p> <AlertInfo index={2} />
          <p style={{ flex: "1", textAlign: "right" }}> ₩400,000</p>
        </div>
        <div className="farming-grid">
          <p>누적된 리워드</p> <AlertInfo index={3} />
          <p style={{ flex: "1", textAlign: "right" }}> ₩600,000</p>
        </div>
        <div className="farming-grid">
          <p>예상 APR 평균</p> <AlertInfo index={4} />
          <p style={{ flex: "1", textAlign: "right" }}> 11.11%</p>
        </div>
        <div className="farming-grid">
          <p>현재 수익률 평균</p> <AlertInfo index={5} />
          <p style={{ flex: "1", textAlign: "right" }}> 11.11%</p>
        </div>
      </div>
  <p style={{ fontSize: "1em", textAlign: 'left' }}>프로토콜별 요약</p>
    {KlayBalance && (
      <FarmingInfo balance={KlayBalance} atype="Klaytn" />
    )}
    {BSCBalance && <FarmingInfo balance={BSCBalance} atype="BSC" />}
    </>
  );
}

export default withRouter(StakingSummary);