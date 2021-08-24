import React, { useState } from "react";

import { Container, Row, Col, Button, Alert} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";

import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";

import { auth } from "_actions/user_action";

import Header from "components/Header"; 
import WalletSummary from "./WalletSummary";
import WalletInfo from "./WalletInfo";
import FarmingInfo from "./FarmingInfo";
import PortfolioSubMenu from "components/PortfolioSubMenu";

import LineChart from "components/charts/LineChart";
import DoughnutChart from "components/charts/DoughnutChart";
import { Doughnut } from "react-chartjs-2";

import {
  FormControl,
  Select,
  MenuItem,
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
  IconButton
} from "@material-ui/core";


import "./dashboard_page.css";
import StakingInfo from "./StakingInfo";


function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
    style: { fontSize: "12px" },
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={4} style={{ width: "100%" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const summaryInfo = {
  money: {
    netWorth: 10000000,
    totalAssets: 10000000,
    totalDebts: 0
  },
  rate: {
    netWorth: 200.0,
    totalAssets: 200.0,
    totalDebts: 0.0
  },
  growth: {
    netWorth: 5000000,
    totalAssets: 5000000,
    totalDebts: 0
  },
  getMoney: function(summaryType) {
    const money = this.money[summaryType].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return money + "원";
  },
  getRate: function(summaryType) {    
    if(this.rate[summaryType] >= 0) return "▴ " + this.rate[summaryType] + ".0 %";
    else return "▾ " + -this.rate[summaryType] + ".0 %";
  },
  getGrowth: function(summaryType){
    const growth = this.growth[summaryType].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if(this.growth[summaryType] >= 0) return "+" + growth + "원";
    else return growth + "원";
  }
};

const getClass = function(num){
  if(num > 0) return "rise";
  else if(num < 0) return "drop";
  return "keep";
}

function DashboardPage(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [userInfo, setUserInfo] = useState({});
  const [KlayBalance, setKlayBalance] = useState({});
  const [BSCBalance, setBSCBalance] = useState({});
  const [BSCLending, setBSCLending] = useState({});

  const [cardIndex, setCardIndex] = useState(1);
  // const [networkType, setNetworkType] = useState("All");

  const handleCardIndexChange = (_, newIndex) => {
    setCardIndex(newIndex);
  };
  // const onNetworkTypeHandler = (_, newType) => {
  //   setNetworkType(newType);
  // };
  console.log("??: ", props.location)
  const [summaryType, setSummaryType] = useState(props.location.state ?  props.location.state.summaryType : "netWorth");

  const onSummaryTypeHandler = (event) => {
    setSummaryType(event.target.value);
  }

  /* 파밍영역 : info알림기능 */
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
    // console.log(props.location.state.summaryType);
    // let summaryType = props.location.state.summaryType || "netWorth";
    // setSummaryType();

    dispatch(auth()).then((res) => {
      if (res.payload) {
        setUserInfo(res.payload);
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
      <PortfolioSubMenu menuIndex={0} />
      <Container>
        <div
          className="container-border"
          style={{ margin: "20px auto" }}
        >
          <div
            style={{
              height: "2rem",
              display: "flex",
              flexDirection: "row",
              // padding: '5px',
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                // padding: '5px',
                fontSize: "14px",
                flex: "1",
              }}
            >
              <FormControl>
                <Select
                  onChange={(e)=>{onSummaryTypeHandler(e)}}
                  value={summaryType}
                  style={{
                    textAlign: "left",
                    // height: '40px',
                    backgroundColor: "",
                    borderColor: "none",
                    border: "none",
                    color: "#4F4F4F",
                    // marginBottom: '10px'
                    padding: "0",
                  }}
                >
                  <MenuItem style={{}} value="netWorth">
                    순 자산
                  </MenuItem>
                  <MenuItem style={{}} value="totalAssets">
                    총 자산
                  </MenuItem>
                  <MenuItem style={{}} value="totalDebts">
                    총 부채
                  </MenuItem>
                </Select>
              </FormControl>
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
                className = {getClass(summaryInfo.rate[summaryType])}
                style={{
                  margin: "0 0 0 10px",
                  padding: "1px 3px",
                  fontSize: "12px",
                  display: "inline",
                }}
              >
                {summaryInfo.getRate(summaryType)}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  display: "inline",
                }}
              >
                {summaryInfo.getMoney(summaryType)}
              </div>
              {/* 상승시 */}
            </div>
          </div>
          <LineChart summaryType = {summaryType} />
        </div>

        <div
          style={{ marginBottom: "20px" }}
        >
          <Row style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "80px" }}>
          <Col style={{ textAlign: 'left' }}>
              <span
                style={{
                  fontSize: "16px",
                  margin: "0 0 0 15px",
                }}
              >
                순 자산
              </span>
            </Col>
            <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
              <span style={{ flex: "1", marginTop: "5px" }}>{summaryInfo.getMoney("netWorth")}</span>
              <span
                className={getClass(summaryInfo.growth["netWorth"])}
                style={{
                  flex: "1",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: "lighter",
                  marginTop: "5px",
                }}
              >
                {summaryInfo.getGrowth("netWorth")}
              </span>
            </Col>
          </Row>
          <Divider/>
        
          <Row style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "80px" }}>
            <Col style={{ textAlign: 'left' }}>
              <span
                style={{
                  fontSize: "16px",
                  margin: "0 0 0 15px",
                }}
              >
                총 자산
              </span>
            </Col>
            <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
              <span style={{ flex: "1", marginTop: "5px" }}>{summaryInfo.getMoney("totalAssets")}</span>
              <span
                className={getClass(summaryInfo.growth["totalAssets"])}
                style={{
                  flex: "1",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: "lighter",
                  marginTop: "5px",
                }}
              >
                {summaryInfo.getGrowth("totalAssets")}
              </span>
            </Col>
          </Row>

          <Divider/>
            
          <Row style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "80px" }}>
            <Col style={{ textAlign: 'left' }}>
              <span
                style={{
                  fontSize: "16px",
                  margin: "0 0 0 15px",
                }}
              >
                총 부채
              </span>
            </Col>
            <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
              <span style={{ flex: "1", marginTop: "5px" }}>{summaryInfo.getMoney("totalDebts")}</span>
              <span
                className={getClass(summaryInfo.growth["totalDebts"])}
                style={{
                  flex: "1",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: "lighter",
                  marginTop: "5px",
                }}
              >
                {summaryInfo.getGrowth("totalDebts")}
              </span>
            </Col>
          </Row>
          
        </div>
              
              
              {/* 파밍 */}
              {/* <TabPanel value={cardIndex} index={2}>
                <div className="container-border">
                  <div
                    style={{
                      height: "2rem",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        flex: "1",
                      }}
                    >
                      총 평가 금액
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        display: "inline",
                      }}
                    >
                      ₩ 10,000,000
                    </div>
                    <div
                      style={{
                        margin: "0 0 0 10px",
                        padding: "1px 3px",
                        fontSize: "12px",
                        display: "inline",
                        color: "#E64743",
                        border: "0.5px solid #E64743",
                        borderRadius: "5px",
                      }}
                    >
                      ▴ 100.00 %
                    </div>
                  </div>
                  <LineChart />
                </div>

                <div className="container-border">
                      <p style={{ fontSize: "0.8rem" }}>종합 요약</p>
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

                <div className="container-border">
                  <p style={{ fontSize: "0.8rem" }}>프로토콜별 요약</p>
                  {KlayBalance && (
                    <FarmingInfo balance={KlayBalance} atype="Klaytn" />
                  )}
                  {BSCBalance && <FarmingInfo balance={BSCBalance} atype="BSC" />}
                </div>
              </TabPanel>
              {/* 스테이킹 */}
              <TabPanel value={cardIndex} index={3}>
                <div className="container-border">
                  <div                     
                    style={{
                      height: "2rem",
                      display: "flex",
                      flexDirection: "row",
                      // padding: '5px',
                      justifyContent: "space-between",
                    }}
                  >
                      <div
                      style={{
                        // padding: '5px',
                        fontSize: "14px",
                        flex: "1",
                      }}
                    >
                      총 평가 금액
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        display: "inline",
                      }}
                    >
                      ₩ 10,000,000
                    </div>
                    {/* 상승시 */}
                    <div                     
                      style={{
                        margin: "0 0 0 10px",
                        padding: "1px 3px",
                        fontSize: "12px",
                        display: "inline",
                        color: "#E64743",
                        border: "0.5px solid #E64743",
                        borderRadius: "5px",
                      }}
                    >
                      ▴ 100.00 %
                    </div>
                </div>
                <LineChart />
                </div>
                <p style={{ fontSize: "0.8rem" }}>종합 요약</p>
                <div className="container-border" style={{backgroundColor: '#f2f2f2'}} >
                      <div className="staking-grid">
                        <p>총 매수 금액</p> <AlertInfo />
                        <p style={{ flex: "1", textAlign: "right" }}> ₩3,600,000</p>
                      </div>
                      <div className="staking-grid">
                        <p>총 평가 금액</p> <AlertInfo />
                        <p style={{ flex: "1", textAlign: "right" }}> ₩4,000,000</p>
                      </div>
                      <div className="staking-grid">
                        <p>리워드 합계</p> <AlertInfo />
                        <p style={{ flex: "1", textAlign: "right" }}> ₩400,000</p>
                      </div>
                      <div className="staking-grid">
                        <p>수확된 리워드</p> <AlertInfo />
                        <p style={{ flex: "1", textAlign: "right" }}> ₩600,000</p>
                  </div>
                  <div className="staking-grid">
                    <p>예상 APR 평균</p> <AlertInfo />
                    <p style={{ flex: "1", textAlign: "right" }}> 11.11%</p>
                  </div>
                  <div className="staking-grid">
                    <p>현재 수익륜 평균</p> <AlertInfo />
                    <p style={{ flex: "1", textAlign: "right" }}> 11.11%</p>
                  </div>
                </div>

                <div className="container-border">
                  <p style={{ fontSize: "0.8rem" }}>프로토콜별 요약</p>
                  {KlayBalance && (
                    <StakingInfo balance={KlayBalance} atype="Klaytn" />
                  )}
                  {BSCBalance && <StakingInfo balance={BSCBalance} atype="BSC" />}
                </div>

              </TabPanel>
              <TabPanel value={cardIndex} index={4}>
                예금
              </TabPanel> 
      </Container>
    </>
  );
}

export default withRouter(DashboardPage);
