import React, { useState } from 'react'; 
import { useHistory } from 'react-router-dom'; 

import { withRouter } from 'react-router';

import { IconButton, Divider } from '@material-ui/core';
import Menu from '@material-ui/icons/Menu';
import { Row, Col, Modal, Button, Container } from 'react-bootstrap'; 
import logo_img from 'static/img/logo_img.png';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Header from 'components/Header';

import StackedBarChart from '../../components/charts/StackedBarChart'

import './PortfolioMain.css';

function PortfolioMain(props) {

  const [ isEmpty, setEmpty ] = useState(true);

  const history = useHistory(); 

  return ( 
    <>
      <Header />
      <Row>
        <Col style={{ marginTop: '20px', marginLeft: '10px', textAlign: 'left' }}>
          <h5 style={{ fontWeight: '600' }}>반가워요, 춤추는 올빼미 님</h5>
        </Col>
      </Row>
      <Row>
        <Col align='center' style={{ marginTop: '20px' }}>
          <div style={{ backgroundColor: '#615EFF', borderRadius: '3px', boxShadow: '0px 0px 14px -1px rgba(0,0,0,0.4)' }}>
            <span 
              style={{ 
                padding: '20px',
                color: '#A2B9FC', 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-between',
              }}
              onClick={() => { history.push('/portfolio/summary', { summaryType: 'netWorth' }) }}
            >
              <p style={{ margin: 'auto 0', fontSize: '1em', alignSelf: 'center' }}>순자산</p>
              <span style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center'}}>
                <p style={{ margin: 'auto 0', color: '#F2F2F2', fontSize: '1.2em' }}>0원&nbsp;</p>
                <NavigateNextIcon style={{alignSelf:'center'}} />
              </span>
            </span>
            <span 
              style={{ 
                padding: '20px',
                color: '#A2B9FC', 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-between',
              }}
              onClick={() => { history.push('/portfolio/summary', { summaryType: 'totalAssets' }) }}
            >
              <p style={{ margin: 'auto 0', fontSize: '1em', alignSelf: 'center' }}>총자산</p>
              <span style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center'}}>
                <p style={{ margin: 'auto 0', color: '#F2F2F2', fontSize: '1.2em' }}>0원&nbsp;</p>
                <NavigateNextIcon style={{alignSelf:'center'}} />
              </span>
            </span>
            <span 
              style={{ 
                padding: '20px',
                color: '#A2B9FC', 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-between',
              }}
              onClick={() => { history.push('/portfolio/summary', { summaryType: 'totalDebts' }) }}
            >
              <p style={{ margin: 'auto 0', fontSize: '1em', alignSelf: 'center' }}>총부채</p>
              <span style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center'}}>
                <p style={{ margin: 'auto 0', color: '#F2F2F2', fontSize: '1.2em' }}>0원&nbsp;</p>
                <NavigateNextIcon style={{alignSelf:'center'}} />
              </span>
            </span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col style={{ margin: '20px 0' }}>
          <StackedBarChart />
        </Col>
      </Row>

      {/* 포트폴리오 메인 경계선 */}
      <Row>
        <div style={{ backgroundColor: '#F5F5F5', height: '10px', width: '100%' }}></div>
      </Row>


      <Container style={{ paddingLeft: '5px', paddingRight: '5px'}}>
        {/* 지갑 */}
        <Row style={{ margin: '10px auto', height: '4rem'}} onClick={() => { history.push('/portfolio/wallet') }}>
          <Col xs='2' style={{ alignSelf: 'center', padding: '5px'}}>
            {/* 아이콘으로 대체해야함 */}
            <div style={{ backgroundColor: '#DDE8FC', width: '31px', height: '31px', borderRadius: '50%', color: '#615EFF', fontWeight: 'bold' }}>₩</div> 
          </Col>
          <Col xs='3' style={{ padding:'0' ,fontWeight: '500', textAlign: 'left', display: 'flex', alignSelf: 'center'}}>
            지갑
          </Col>
          <Col xs='5' style={{padding: '0', alignSelf: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
              <span>2,000,000원</span>
              <span class='rise' style={{fontSize: '12px'}}>+1,000,000원 (200.0%)</span>
            </div>
          </Col>
          <Col xs='2' style={{alignSelf: 'center', paddingRight: '0', color: '#BDBDBD'}}>
            <NavigateNextIcon />
          </Col>
        </Row>
        
        {/* 경계선 */}
        <Divider />

        {/* 디파이 */}
        <Row style={{ margin: '10px auto', height: '4rem'}}>
          <Col xs='2' style={{ alignSelf: 'center', padding: '5px'}}>
            {/* 아이콘으로 대체해야함 */}
            <div style={{ backgroundColor: '#FFE6B3', width: '31px', height: '31px', borderRadius: '50%', color: '#FFAF31', fontWeight: 'bold' }}>D</div> 
          </Col>
          <Col xs='3' style={{ padding:'0' ,fontWeight: '500', textAlign: 'left', display: 'flex', alignSelf: 'center'}}>
            디파이
          </Col>
          <Col xs='5' style={{padding: '0', alignSelf: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
            <span>2,000,000원</span>
              <span class='rise' style={{fontSize: '12px'}}>+1,000,000원 (200.0%)</span>
            </div>
          </Col>
          {/* <Col xs='2' style={{alignSelf: 'center', paddingRight: '0'}}>
            <NavigateNextIcon />
          </Col> */}
        </Row>


        <Row style={{ margin: '10px auto', height: '5rem'}}>
          <Col xs='2' style={{ alignSelf: 'center', padding: '0 0 0 1em'}}>
            {/* 아이콘으로 대체해야함 */}
            <div style={{ backgroundColor: '#F2F2F2', width: '31px', height: '31px', borderRadius: '50%', color: '#BDBDBD', fontWeight: 'bold' }}>F</div> 
          </Col>
          <Col xs='3' style={{ padding:'0 0 0 1em' ,fontWeight: '500', textAlign: 'left', display: 'flex', alignSelf: 'center'}}>
            파밍
          </Col>
          <Col xs='5' style={{padding: '0', alignSelf: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
              <span>3,600,000원</span>
              <span class='rise' style={{fontSize: '12px'}}>+2,000,000원 (200.0%)</span>
              <span style={{fontSize: '12px', color: '#828282'}}>누적 리워드 : 20,000 원</span>
            </div>
          </Col>
          <Col xs='2' style={{alignSelf: 'center', paddingRight: '0', color: '#BDBDBD'}}>
            <NavigateNextIcon />
          </Col>
        </Row>

        <Row style={{ margin: '10px auto', height: '5rem'}}>
          <Col xs='2' style={{ alignSelf: 'center', padding: '0 0 0 1em'}}>
            {/* 아이콘으로 대체해야함 */}
            <div style={{ backgroundColor: '#F2F2F2', width: '31px', height: '31px', borderRadius: '50%', color: '#BDBDBD', fontWeight: 'bold' }}>S</div> 
          </Col>
          <Col xs='3' style={{ padding:'0 0 0 1em' ,fontWeight: '500', textAlign: 'left', display: 'flex', alignSelf: 'center'}}>
            스테이킹
          </Col>
          <Col xs='5' style={{padding: '0', alignSelf: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
              <span>4,000,000원</span>
              <span class='rise' style={{fontSize: '12px'}}>+2,000,000원 (200.0%)</span>
              <span style={{fontSize: '12px', color: '#828282'}}>누적 리워드 : 20,000 원</span>
            </div>
          </Col>
          <Col xs='2' style={{ alignSelf: 'center', paddingRight: '0', color: '#BDBDBD' }}>
            <NavigateNextIcon />
          </Col>
        </Row>

        <Modal
          show={isEmpty}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body style={{ fontSize: '14px', textAlign: 'center', padding: '3em 0'}}>
            아직 추가된 지갑이 없습니다.<br/>
            자산 포트폴리오를 추적하기 위해<br/>
            먼저 지갑 주소를 추가해 주세요.<br/>
            <Button 
              onClick={() => {setEmpty(false)}}
              style={{ width: '90%', height: '50px', marginTop: '2em', backgroundColor: '#615EFF', color: '#FFFFFF', fontWeight: 'bold' }}
            >지갑 주소 추가하기</Button>
          </Modal.Body>
        </Modal> 
      </Container>
    </>
  )
}

export default withRouter(PortfolioMain)