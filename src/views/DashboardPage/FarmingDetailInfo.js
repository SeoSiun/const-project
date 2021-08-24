import React, { useState } from "react";

import { Container, Row, Col, Button, Alert, Modal } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import SvgIcon from "@material-ui/core/SvgIcon";

import MenuBar from "components/MenuBar";

import ksp_img from "static/img/token_icon/ksp_logo.png";

function FarmingDetailInfo(props) {
  const [farmingModal, setFarmingModal] = useState(false);
  const [rewardModal, setRewardModal] = useState(false);
  const [text, setText] = useState('수정');
  const [status, setStatus] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const helpMsgs = [
    { type: "총 매수 금액", description: "'매수 금액'은 풀에 처음 유동성 공급을 했을 당시 예치한 토큰의 원화 환산 금액입니다." },
    { type: "총 평가 금액", description: "'평가 금액'은 예치한 토큰의 현재 원화 환산 가치입니다." },
    { type: "리워드 합계", description: "'리워드'는 현재 수확할 수 있는 리워드를 말합니다. 쌓인 리워드를 수확할 경우 숫자가 초기화 되어 0부터 재시작 합니다." },
    { type: "누적된 리워드", description: "'누적된 리워드' 는 풀에 처음 유동성 공급을 한 이후부터 현재까지 이미 수확이 끝난 리워드와 현재의 리워드 합계를 합한 총량의 총량입니다. \n *블록 추적 상황에 따라 부정확할 수 있습니다. 참고 용도로만 사용해주세요." },
    { type: "예상 APR 평균", description: "'예상 APR'은 해당 프로토콜에서 풀에 표기한 연간 이율입니다." },
    { type: "현재 수익률 평균", description: "'현재 수익률'은 해당 풀에 처음 예치한 이후 발생한 이익을 백분율로 표시한 수치입니다. 예치한 토큰의 가치 변동에 따라 수시로 변화합니다." },
    { type: "현재 APR 평균", description: "'현재 APR'은 현재 수익률을 365일로 환산한 수치입니다. 예치한 토큰의 가치 변동에 따라 수시로 변화합니다." },
  ];
  const setPurchaseAmount = () => {
    if(text == '수정'){
      setStatus(!status);
      setText('저장');
    }else if(text == '저장'){
      setDisabled(true);
    }
  }
  function AlertInfo(nTh) {
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
            position: "absolute", 
            top: "0", 
            left: "0", 
            width: "100vw", 
            height: "100vh", 
            backgroundColor: "rgb(0 0 0 / 39%)", 
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
          width: "15px",
          height: "15px",
          padding: "0",
          fontSize: "10px",
          margin: "auto",
          marginLeft: "5px",
          borderRadius: "15px",
        }}
      >
        i
      </Button>
    );
  }

  return (
    <Container style={{ padding: "0" }}>
      <Row
        className="align-items-center"
        style={{
          padding: "20px 0 0",
          position: "relative",
        }}
      >
        <Col xs={1}>
          <Link to="./portfolio">
            <IconButton aria-label="before" component="span">
              <NavigateBeforeIcon />
            </IconButton>
          </Link>
        </Col>
        <Col>
          {<img src={ksp_img} />}
          <span style={{ fontWeight: "700", paddingLeft: "5px" }}>
            KLAY SWAP
          </span>
        </Col>
        <Col xs={1} style={{marginRight: '40px'}}> 
          <MenuBar /> 
        </Col>
      </Row>

      <Row 
        style={{
          textAlign: "left", 
          paddingLeft: "5px"
        }}
      > 
        <Col>
          <p style={{ fontSize: "0.8rem" }}>요약</p>
        </Col>
      </Row>
      <Row
        className="align-items-center"
        style={{
          textAlign: "left",
          margin: "0 auto",
          height: "60px",
          left: "0",
          width: "100%",
        }}
      >
        <Col style={{ padding: "0" }}>
          <div className="container-border" style={{
            fontSize: '13px', 
            backgroundColor: '#F2F2F2'
          }}>
            
            <div className="farming-grid">
              <p>총 매수 금액</p> <AlertInfo index={0} />
              <p style={{ flex: "1", textAlign: "right" }}> ₩--------</p>
            </div>
            <div className="farming-grid">
              <p>총 평가 금액</p> <AlertInfo index={1} />
              <p style={{ flex: "1", textAlign: "right", fontWeight: "bold" }}>4,000,000원</p>
            </div>
            <div className="farming-grid">
              <p>리워드 합계</p> <AlertInfo index={2} />
              <p style={{ flex: "1", textAlign: "right", fontWeight: "bold" }}>4,000,000원</p>
            </div>
            <div className="farming-grid">
              <p>누적된 리워드</p> <AlertInfo index={3} />
              <p style={{ flex: "1", textAlign: "right", fontWeight: "bold" }}>4,000,000원</p>
            </div>
            <div className="farming-grid">
              <p>예상 APR 평균</p> <AlertInfo index={4} />
              <p style={{ flex: "1", textAlign: "right", fontWeight: "bold" }}>11%</p>
            </div>
            <div className="farming-grid">
              <p>현재 수익률 평균</p> <AlertInfo index={5} />
              <p style={{ flex: "1", textAlign: "right", fontWeight: "bold" }}>11%</p>
            </div>
            <div className="farming-grid">
              <p>현재 APR 평균</p> <AlertInfo index={6} />
              <p style={{ flex: "1", textAlign: "right", fontWeight: "bold" }}>11%</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              block
              style={{
                color: "#FFFFFF",
                backgroundColor: "#615EFF",
                border: "#E0E0E0",
                fontSize: "14px",
                width: "100%"
              }}
              onClick={() => { setRewardModal(true) }}
            >
              쌓인 리워드 받기
            </Button>
          </div>

          {/* <div className="container-border grid-row-offset"> */}
            <p style={{ fontSize: "0.8rem" }}>풀</p>

            <div className="wallet-coin-item">
              <div className="container-border" style={{ margin: "0" }}>
                <Row style={{ height: "40px" }}>
                  <Col xs={1}>{<img src={ksp_img} />}</Col>
                  <Col xs={7}>
                    {
                      <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                        KSP + ETH
                      </span>
                    }
                    <div
                      style={{
                        margin: "0 0 0 10px",
                        padding: "1px 3px",
                        fontSize: "12px",
                        display: "inline",
                        color: "#615EFF"
                      }}
                    >
                      ▾ 89.30 %
                    </div>
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      size="sm"
                      style={{
                        backgroundColor: "#f2f2f2",
                        color: "#828282",
                        borderStyle: "none",
                        width: "78px",
                        float: "right",
                        borderRadius:"1px"
                    }}
                    onClick={() => { setFarmingModal(true) }}
                    >
                      관리
                    </Button>
                  </Col>
                </Row>

                <div className="farming-grid">
                  <p style={{ flex: "1" }}>예치 수량</p>{" "}
                  <p style={{ textAlign: "right" }}>
                    {" "}
                    123.0000 KSP + 2.0000 ETH
                  </p>
                </div>
                <div className="farming-grid">
                  <p style={{ flex: "1" }}>매수 금액</p>{" "}
                  <p style={{ textAlign: "right", paddingRight:"10px", display:status?'block':'none' }}>900,000</p>
                  <input type="number" disabled={disabled} style={{display:'none', border:"none", backgroundColor:"#f2f2f2", display:!status? 'block':'none'}}
                    />  

                   원
                  <Button
                      variant="secondary"
                      size="sm"
                      style={{
                        backgroundColor: "#f2f2f2",
                        color: "#828282",
                        borderStyle: "none",
                        width: "45px",
                        float: "right",
                        borderRadius:"1px"
                    }}
                    onClick={setPurchaseAmount}
                    >
                      {text}
                    </Button>
                </div>
                <div className="farming-grid">
                  <p style={{ flex: "1" }}>평가 금액</p>{" "}
                  <p style={{ textAlign: "right" }}>1,000,000원</p>
                </div>
                <div className="farming-grid">
                  <p style={{ flex: "1" }}>리워드</p>{" "}
                  <p style={{ textAlign: "right" }}> 1.0000 KSP (100,000원)</p>
                </div>
                <div className="farming-grid">
                  <p style={{ flex: "1" }}>누적된 리워드</p>{" "}
                  <p style={{ textAlign: "right" }}> 0.5600 KSP (5,03원7)</p>
                </div>
                <div className="farming-grid">
                  <p style={{ flex: "1" }}>예상 APR</p>{" "}
                  <p style={{ textAlign: "right" }}> 77.11%</p>
                </div>
                <div className="farming-grid">
                  <p style={{ flex: "1" }}>현재 수익률</p>{" "}
                  <p style={{ textAlign: "right" }}> 77.11%</p>
                </div>
                <div className="farming-grid">
                  <p style={{ flex: "1" }}>현재 APR</p>{" "}
                  <p style={{ textAlign: "right" }}> 77.11%</p>
                </div>
              </div>
            </div>
          {/* </div> */}
        </Col>
      </Row>
      {/*스테이킹 모달*/}
      <Modal
          show={farmingModal}
         
          keyboard={false}
          onHide={() => { setFarmingModal(false) }}
        >
          <Modal.Header closeButton style={{ border: 'none', fontWeight:"bold" }}>
            풀 관리
          </Modal.Header>
          <Modal.Body style={{ fontSize: '14px', textAlign: 'center', padding: '1em 0' }}>
            <Row>
              <Col xs={{ span: 5, offset: 1}}>
                <Button
                  variant="primary"
                  size="lg"
                  //block
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#615EFF",
                    border: "#E0E0E0",
                    fontSize: "14px",
                    width: "100%",
                                      
                  }}
                  onClick={() => { setFarmingModal(true) }}
                >
                  <div className="staking-button">
                    <p style={{ flex: "1", textAlign: "center" }}>+ 유동성 추가</p>
                  </div>
                </Button >
              </Col >
              <Col xs={{ span: 5, offset: 0}}>
                <Button
                  variant="primary"
                  size="lg"
                  //block
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#615EFF",
                    border: "#E0E0E0",
                    fontSize: "14px",
                    width: "100%",
                  
                  }}
                  onClick={() => { setFarmingModal(true) }}
                >
                  <div className="staking-button">
                    <p style={{ flex: "1", textAlign: "center" }}>- 유동성 회수</p>
                  </div>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={{ span: 10, offset: 1}}>
                <Button
                  variant="primary"
                  size="lg"
                  //block
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#615EFF",
                    border: "#E0E0E0",
                    fontSize: "14px",
                    marginTop: "1em",
                    width: "100%",
                  }}
                  onClick={() => { setFarmingModal(true) }}
                >
                  <div className="staking-button">
                    <p style={{ flex: "1", textAlign: "center" }}>리워드 받기</p>
                  </div>
                </Button>
              </Col>

            </Row>
          </Modal.Body>
        </Modal>

        {/*리워드 모달*/}
        <Modal
          show={rewardModal}
         
          keyboard={false}
          onHide={() => { setRewardModal(false) }}
        >
          <Modal.Body style={{ fontSize: '14px', textAlign: 'center', padding: '1em 0' }}>
            <Row>
              <Col>
                  <p style={{textAlign: "center"}}>준비 중인 기능입니다. 기대해주세요 :)</p>
              </Col >
            </Row>
            <Row>
              <Col >
                <Button
                  variant="primary"
                  size="lg"
                  //block
                  style={{
                    color: "#615EFF",
                    fontSize: "14px",
                    width: "100%",
                    backgroundColor:"#fff",
                    border:"none",
                    fontWeight:"700"

                  }}
                  onClick={() => { setRewardModal(true) }}
                >
                  확인
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
    </Container>
  );
}

export default withRouter(FarmingDetailInfo);
