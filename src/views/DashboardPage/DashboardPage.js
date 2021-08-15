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

// const periodOptions = [
//   { type: "1D" },
//   { type: "1W" },
//   { type: "1M" },
//   { type: "3M" },
// ];

function DashboardPage(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [userInfo, setUserInfo] = useState({});
  const [KlayBalance, setKlayBalance] = useState({});
  const [BSCBalance, setBSCBalance] = useState({});
  const [BSCLending, setBSCLending] = useState({});

  const [cardIndex, setCardIndex] = useState(1);
  // const [networkType, setNetworkType] = useState("All");

  const [periodType, setPeriodType] = useState("1D");

  const handleCardIndexChange = (_, newIndex) => {
    setCardIndex(newIndex);
  };
  // const onNetworkTypeHandler = (_, newType) => {
  //   setNetworkType(newType);
  // };

  const getAssetGraphValue = (periodOpt) => {
    // DB에서 새로운 그래프 데이터 불러오기

    // state에 값저장
    setPeriodType(periodOpt);
  };

  const [summaryType, setSummaryType] = useState("netWorth");

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
      <Container style={{ padding: "0" }}>
        <Row
          className="align-items-center"
          style={{
            textAlign: "left",
            margin: "0 auto",
            height: "60px",
            // position: 'absolute',
            left: "0",
            width: "100%",
          }}
        >
          <Col style={{ padding: "0" }}>
            <AppBar position="static" color="white" elevation={0}>
              <Tabs
                value={cardIndex}
                onChange={handleCardIndexChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                scrollButtons="on"
              >
                <Tab label="요약" {...a11yProps(0)} />
                <Tab label="지갑" {...a11yProps(1)} />
                <Tab label="파밍" {...a11yProps(2)} />
                <Tab label="스테이킹" {...a11yProps(3)} />
              </Tabs>
            </AppBar>
            <Divider />
            <SwipeableViews
              // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={cardIndex}
              onChangeIndex={handleCardIndexChange}
              style={{ margin: "0px" }}
            >
              {/* 전체 */}
              <TabPanel value={cardIndex} index={0}>
                {/* <div style={{height: '1080px'}}>
                  전체
                </div> */}
                <div
                  className="container-border"
                  style={{ marginBottom: "20px" }}
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
                        style={{
                          margin: "0 0 0 10px",
                          padding: "1px 3px",
                          fontSize: "12px",
                          display: "inline",
                          color: "#615EFF",
                        }}
                      >
                        ▾ 3.2 %
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          display: "inline",
                        }}
                      >
                        ₩ 31,000,000
                      </div>
                      {/* 상승시 */}
                    </div>
                  </div>

                  <LineChart />
                </div>

                <div
                  style={{ marginBottom: "20px" }}
                >
                  <Row style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "80px" }}>
                    <Col>
                      <span
                        style={{
                          fontSize: "16px",
                          marginBottom: "0",
                        }}
                      >
                        순 자산
                      </span>
                    </Col>
                    <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                      <span style={{ flex: "1", marginTop: "5px" }}>₩ 31,000,000</span>
                      <span
                        className="rise"
                        style={{
                          flex: "1",
                          textAlign: "right",
                          fontSize: "12px",
                          fontWeight: "lighter",
                          marginTop: "5px",
                        }}
                      >
                        + ₩ 30,000
                      </span>
                    </Col>
                  </Row>
                  <Divider/>
                
                  <Row style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "80px" }}>
                    <Col>
                      <span
                        style={{
                          fontSize: "16px",
                          marginBottom: "0",
                        }}
                      >
                        총 자산
                      </span>
                    </Col>
                    <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                      <span style={{ flex: "1", marginTop: "5px" }}>₩ 34,000,000</span>
                      <span
                        className="rise"
                        style={{
                          flex: "1",
                          textAlign: "right",
                          fontSize: "12px",
                          fontWeight: "lighter",
                          marginTop: "5px",
                        }}
                      >
                        + ₩ 30,000
                      </span>
                    </Col>
                  </Row>

                  <Divider/>
                    
                  <Row style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "80px" }}>
                    <Col>
                      <span
                        style={{
                          fontSize: "16px",
                          marginBottom: "0",
                        }}
                      >
                        총 부채
                      </span>
                    </Col>
                    <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                      <span style={{ flex: "1", marginTop: "5px" }}>₩ 3,000,000</span>
                      <span
                        className="drop"
                        style={{
                          flex: "1",
                          textAlign: "right",
                          fontSize: "12px",
                          fontWeight: "lighter",
                          marginTop: "5px",
                        }}
                      >
                        - ₩ 30,000
                      </span>
                    </Col>
                  </Row>
                  
                </div>
              </TabPanel>
              {/* 지갑 */}
              <TabPanel value={cardIndex} index={1}>
                <WalletSummary />
              </TabPanel>
              {/* <TabPanel value={cardIndex} index={2}>
                {BSCLending && 
                  <LendingInfo lending={BSCLending} marginBottom='50px' /> }
              </TabPanel> */}
              {/* 파밍 */}
              <TabPanel value={cardIndex} index={2}>
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
                    {/* <ul style={{
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'row',
                      listStyleType: 'none',
                      fontSize: '0.7em',
                      justifyContent: 'space-around'
                    }}>
                      { periodOptions.map((opt, index) => {
                        return <li 
                          className={opt.type === periodType ? 'selected-period' : 'default-period'} 
                          key={`periodOpt${index}`} 
                          onClick={() => getAssetGraphValue(opt.type)}
                          >{opt.type}</li>
                      }) }
                    </ul> */}
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
              <TabPanel value={cardIndex} index={3}>
                스테이킹
              </TabPanel>
              <TabPanel value={cardIndex} index={4}>
                예금
              </TabPanel>
            </SwipeableViews>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default withRouter(DashboardPage);
