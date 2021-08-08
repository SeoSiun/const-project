import React from 'react'; 

import { useHistory } from "react-router-dom";

import {Container, Row, Col, } from 'react-bootstrap'; 
import logoImg from 'static/img/logo_img.png'; 
import Anime from 'react-anime'; 

const SplashPage = () => {
  const history = useHistory();

  return  ( 
    <>
      <div style={{display: 'table', width: '100%'}}>
        <Container>
          <Row className="align-items-start">
            <Anime 
              easing="easeInSine"
              duration={500}
              delay={2000}
              direction="normal"
              translateY="-20px"
              opacity={[0, 1]}
            >
              <Col style={{textAlign: 'right', paddingRight: '0', marginTop: '30px', fontSize: '15px', color: '#828282'}}>
                둘러보기
              </Col>
            </Anime>
          </Row>
          <Row className="align-items-end" style={{height: '200px', width: '100%', paddingTop: '100px'}}>
            <Col style={{textAlign: 'center'}}>
              <Anime
                easing="easeInSine"
                duration={1000}
                delay={500}
                direction="normal"
                // translateX="-40%"
                translateX={window.innerWidth * (-0.27)}
                translateY="-50px"
                // scale={[1, .6]}
              >
                <img 
                  src={logoImg} 
                  style={{
                    marginTop: '150px',
                    width: '50%', 
                    height: '50%', 
                    maxWidth: '200px'
                  }}/>
              </Anime>
            </Col>
          </Row>
          <Row 
            className="align-items-end"
            style={{height:'130px'}}
          >
            <Col md={12}>
              <Anime
                easing="easeInSine"
                duration={500}
                delay={1500}
                direction="normal"
                translateY="-10px"
                opacity={[0, 1]}
              >
                <div style={{
                  textAlign: 'left', 
                  fontSize: '17px',
                  color:'#000', 
                  fontWeight: 'bold'}} 
                >
                  당신의 디파이 파트너, 클링크
                </div>
                <div style={{
                  textAlign: 'left', 
                  fontSize: '14px', 
                  color: '#828282', 
                  marginTop: '5px'
                }}>
                  한번의 클릭으로 흩어진 자산들을 손쉽게 관리하세요
                </div>
              </Anime>
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{
        position: 'fixed', 
        bottom: '-10px', 
        height: '100px', 
        width: '100%', 
        left: '0', 
        right: '0', 
        margin: '0 auto',
        maxWidth: "900px"
      }}>
        <Anime
          easing="easeInSine"
          duration={500}
          delay={2000}
          direction="normal"
          translateY="-10px"
          opacity={[0, 1]}
        >
          <div 
            onClick={() => {history.push('./signin')}}
            style={{
              height: '100px', 
              backgroundColor: '#615EFF', 
              border: 'none',
              borderRadius: '10px 10px 0 0'
          }}>
            <Row style={{paddingTop: '40px'}} className="align-items-center">
              <Col xs={9} style={{
                fontSize: '14px', 
                color: 'white', 
                padding: '0', 
              }}>
                오늘의 보상을 확인해보러 떠나볼까요?
              </Col>
              <Col style={{
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: 'white', 
                padding: '0', 
                textAlign: 'left'
              }}>
                GO &gt;
              </Col>
            </Row>
          </div>
        </Anime>
      </div>
    </>
  );
}

export default SplashPage;
