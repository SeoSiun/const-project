import React, { useState } from "react";

import { Row, Col, Button, Alert } from "react-bootstrap";


import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import klaytn_img from "static/img/token_icon/klaytn_logo.png";
import bsc_img from "static/img/token_icon/bsc_logo.png";


function StakingInfo(props) {
  const { balance, atype } = props;

  return (

    <div className="staking-coin-item">
      <div className="container-border" style={{ margin: "0" }}>
        <Row style={{ height: "40px" }}>
          <Col xs={1}>
            {atype == "Klaytn" ? (
              <img src={klaytn_img} />
            ) : (
              <img src={bsc_img} />
            )}
          </Col>
          <Col xs={7}>
            {atype == "Klaytn" ? (
              <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                KLAYswap
              </span>
            ) : (
              <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                BELT.fi
              </span>
            )}
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
          <Col style={{ textAlign: "right" }}>
            <Link to="/StakingDetailInfo">
              <Button
                size="sm"
                style={{
                  backgroundColor: "inherit",
                  color: "#000",
                  border: "none",
                  textDecoration: "underline",
                }}
              >
                자세히 보기
              </Button>
            </Link>
          </Col>
        </Row>


        <div className="staking-grid">
          <p style={{ flex: "1" }}>총 매수 금액</p>{" "}
          <p style={{ flex: "1", textAlign: "right" }}> ₩3,600,000</p>
        </div>
        <div className="staking-grid">
          <p style={{ flex: "1" }}>총 평가 금액</p>{" "}
          <p style={{ flex: "1", textAlign: "right" }}> ₩4,000,000</p>
        </div>
        <div className="staking-grid">
          <p style={{ flex: "1" }}>리워드 합계</p>{" "}
          <p style={{ flex: "1", textAlign: "right" }}> ₩400,000</p>
        </div>
        <Button
          variant="primary"
          size="md"
          //block
          style={{
            color: "#FFFFFF",
            backgroundColor: "#615EFF",
            border: "#E0E0E0",
            fontSize: "14px",
            width: '100%',
          }}
    
        >
          <div className="staking-button">
            <p style={{ flex: "1", textAlign: "left" }}>쌓인 리워드</p>
            <p style={{ flex: "1", textAlign: "center" }}> 4,000,000원</p>
            <p style={{ flex: "1", textAlign: "right" }}> 받기</p>
          </div>

        </Button>
      </div>
    </div>
  );
}

export default withRouter(StakingInfo);
