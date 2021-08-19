import React, { useState } from "react";

import { Container, Row, Col, Button, Alert, Modal } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import MenuIcon from "@material-ui/icons/Menu";
import SvgIcon from "@material-ui/core/SvgIcon";

import bsc_img from "static/img/token_icon/bsc_logo.png";

import logo_img from 'static/img/logo_img.png';

import MenuBar from 'components/MenuBar';
import 'components/Header.css';
import { style } from "@material-ui/system";
import './Modal.css'


function StakingDetailInfo(props) {
    const [stakingModal, setStakingModal] = useState(false);
    const [votingModal, setVotingModal] = useState(false);
    const [rewardModal, setRewardModal] = useState(false);


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

    return (

        <Container style={{ padding: "0" }}>
            <Row
                className='align-items-center'
                style={{
                    height: '90px',
                    paddingBottom: '10px'
                }}
            >
                <Col xs={1} style={{ height: '40px' }}>
                    <Link to="./dashboard">
                        <IconButton aria-label="before" component="span">
                            <NavigateBeforeIcon />
                        </IconButton>
                    </Link>
                </Col>
                <Col xs={{ span: 4, offset: 3 }}>
                    <img src={bsc_img} />
                    <span style={{ fontWeight: "700", paddingLeft: "5px" }}>
                        KLAY SWAP
                    </span>
                </Col>
                <Col xs={{ span: 2, offset: 2 }} style={{ textAlign: 'right' }}>
                    <MenuBar />
                </Col>
            </Row>

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
                    <p style={{ fontSize: "0.8rem" }}>요약</p>
                    <div className="container-border" style={{ backgroundColor: '#f2f2f2' }}>
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
                        <Button
                            variant="primary"
                            size="lg"
                            block
                            style={{
                                color: "#FFFFFF",
                                backgroundColor: "#615EFF",
                                border: "#E0E0E0",
                                fontSize: "14px",
                                width: "100%",
                            }}
                            onClick={() => { setRewardModal(true) }}
                        >
                            쌓인 리워드 받기
                        </Button>
                    </div>
                    <p style={{ fontSize: "0.8rem" }}>스테이킹 풀</p>
                    <div className="farming-coin-item">
                        <div className="container-border" style={{ margin: "0" }}>
                            <Row style={{ height: "40px" }}>
                                <Col xs={1}>{<img src={bsc_img} />}</Col>
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
                                            color: "#615EFF",

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
                                            width: "50%",
                                            float: "right",
                                        }}
                                        onClick={() => { setStakingModal(true) }}
                                    >
                                        관리
                                    </Button>
                                </Col>
                            </Row>

                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>예치 수량</p>{" "}
                                <p style={{ textAlign: "right" }}>
                                    {" "}
                                    123.0000 KSP + 2.0000 ETH
                                </p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>매수 금액</p>{" "}
                                <p style={{ textAlign: "right" }}> ₩900,000</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>평가 금액</p>{" "}
                                <p style={{ textAlign: "right" }}> ₩1,000,000</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>리워드</p>{" "}
                                <p style={{ textAlign: "right" }}> 1.0000 KSP (₩100,000)</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>수확된 리워드</p>{" "}
                                <p style={{ textAlign: "right" }}> 0.5600 KSP (₩5,037)</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>예상 APR</p>{" "}
                                <p style={{ textAlign: "right" }}> 77.11%</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>현재 수익률</p>{" "}
                                <p style={{ textAlign: "right" }}> 77.11%</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>현재 APR</p>{" "}
                                <p style={{ textAlign: "right" }}> 77.11%</p>
                            </div>
                        </div>
                    </div>
                    <div className="staking-vote">
                    <p style={{ fontSize: "0.8rem" }}>투표한 풀</p>
                    <p style={{ flex: "2",fontSize: "0.8rem", textAlign: "right"}}>보유 투표권 </p>
                    <p style={{fontSize: "0.8rem", textAlign: "right"}}>2 vKSP</p>
                    </div>
                    
                    <div className="farming-coin-item" >
                        <div className="container-border" style={{ margin: "0" }}>
                            <Row style={{ height: "40px" }}>
                                <Col xs={1}>{<img src={bsc_img} />}</Col>
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
                                            color: "#615EFF",

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
                                            width: "50%",
                                            float: "right",
                                        }}
                                        onClick={() => { setStakingModal(true) }}
                                    >
                                        관리
                                    </Button>
                                </Col>
                            </Row>

                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>예치 수량</p>{" "}
                                <p style={{ textAlign: "right" }}>
                                    {" "}
                                    123.0000 KSP + 2.0000 ETH
                                </p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>매수 금액</p>{" "}
                                <p style={{ textAlign: "right" }}> ₩900,000</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>평가 금액</p>{" "}
                                <p style={{ textAlign: "right" }}> ₩1,000,000</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>리워드</p>{" "}
                                <p style={{ textAlign: "right" }}> 1.0000 KSP (₩100,000)</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>수확된 리워드</p>{" "}
                                <p style={{ textAlign: "right" }}> 0.5600 KSP (₩5,037)</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>예상 APR</p>{" "}
                                <p style={{ textAlign: "right" }}> 77.11%</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>현재 수익률</p>{" "}
                                <p style={{ textAlign: "right" }}> 77.11%</p>
                            </div>
                            <div className="staking-grid">
                                <p style={{ flex: "1" }}>현재 APR</p>{" "}
                                <p style={{ textAlign: "right" }}> 77.11%</p>
                            </div>
                        </div>
                    </div>

                    <div className="wallet-coin-item">
                        <div className="container-border" style={{ margin: "0" }}>
                            <Row style={{ height: "40px" }}>
                                <Col xs={1}>{<img src={bsc_img} />}</Col>
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
                                            color: "#615EFF",
                                            border: "0.5px solid #615EFF",
                                            borderRadius: "5px",
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
                                            width: "50%",
                                            float: "right",
                                        }}
                                        onClick={() => { setVotingModal(true) }}
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
                                <p style={{ textAlign: "right" }}> ₩900,000</p>
                            </div>
                            <div className="farming-grid">
                                <p style={{ flex: "1" }}>평가 금액</p>{" "}
                                <p style={{ textAlign: "right" }}> ₩1,000,000</p>
                            </div>
                            <div className="farming-grid">
                                <p style={{ flex: "1" }}>리워드</p>{" "}
                                <p style={{ textAlign: "right" }}> 1.0000 KSP (₩100,000)</p>
                            </div>
                            <div className="farming-grid">
                                <p style={{ flex: "1" }}>수확된 리워드</p>{" "}
                                <p style={{ textAlign: "right" }}> 0.5600 KSP (₩5,037)</p>
                            </div>
                            <div className="farming-grid">
                                <p style={{ flex: "1" }}>예상 APR</p>{" "}
                                <p style={{ textAlign: "right" }}> 77.11%</p>
                            </div>
                            <div className="farming-grid">
                                <p style={{ flex: "1" }}>현재 수익률</p>{" "}
                                <p style={{ textAlign: "right" }}> 77.11%</p>
                            </div>
                        </div>
                        
                    </div>
                    
                </Col>
            </Row>
        <>

        </>
        {/*투표 모달*/}
        <Modal
          show={votingModal}
         
          keyboard={false}
          onHide={() => { setVotingModal(false) }}
        >
          <Modal.Header closeButton style={{ border: 'none', fontWeight:"bold" }}>
            투표 관리
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
                  onClick={() => { setVotingModal(true) }}
                >
                  <div className="staking-button">
                    <p style={{ flex: "1", textAlign: "center" }}>투표하기</p>
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
                  onClick={() => { setVotingModal(true) }}
                >
                  <div className="staking-button">
                    <p style={{ flex: "1", textAlign: "center" }}>철회하기</p>
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
                  onClick={() => { setVotingModal(true) }}
                >
                  <div className="staking-button">
                    <p style={{ flex: "1", textAlign: "center" }}>리워드 받기</p>
                  </div>
                </Button>
              </Col>

            </Row>
          </Modal.Body>
        </Modal>

        {/*스테이킹 모달*/}
        <Modal
          show={stakingModal}
         
          keyboard={false}
          onHide={() => { setStakingModal(false) }}
        >
          <Modal.Header closeButton style={{ border: 'none', fontWeight:"bold" }}>
            스테이킹 관리
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
                  onClick={() => { setStakingModal(true) }}
                >
                  <div className="staking-button">
                    <p style={{ flex: "1", textAlign: "center" }}>스테이킹</p>
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
                  onClick={() => { setStakingModal(true) }}
                >
                  <div className="staking-button">
                    <p style={{ flex: "1", textAlign: "center" }}>언스테이킹</p>
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
                  onClick={() => { setStakingModal(true) }}
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
                    backgroundColor: "#FFFFFF",
                    border: "#FFFFFF",
                    fontSize: "14px",
                    width: "50%",
                  }}
                  
                  onClick={() => { setRewardModal(true) }}
                >
                  <div >
                    <p style={{ flex: "1", textAlign: "center" }}>확인</p>
                  </div>
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>

        </Container>

    );
}

export default withRouter(StakingDetailInfo);
