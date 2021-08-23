import React, { useState } from 'react'; 
import { useHistory } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { auth } from '_actions/user_action'; 
import axios from 'axios';

import { withRouter } from 'react-router';

import { IconButton, Divider } from '@material-ui/core';
import Menu from '@material-ui/icons/Menu';
import { Row, Col, Modal, Button, Container } from 'react-bootstrap'; 

import F_icon from 'static/img/etc_icon/F_icon.png'; 
import D_icon from 'static/img/etc_icon/D_icon.png'; 
import S_icon from 'static/img/etc_icon/S_icon.png'; 
import KRW_icon from 'static/img/etc_icon/KRW_icon.png'; 

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Header from 'components/Header';

import StackedBarChart from '../../components/charts/StackedBarChart'

function numberWithCommas(x) {
  return Math.floor(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function variationRatio(curr, prev) { 
  return prev > 0 ? ((curr-prev)/prev * 100).toFixed(1) : 0; 
}


function PortfolioMain(props) {

  const [ isEmpty, setEmpty ] = useState(false);
  const [ userName, setUserName ] = useState(''); 

  const [ assetSummaryInfo, setAssetSummaryInfo ] = useState({total_price: 0, prev_price: 0, }); 
  const [ farmingSummaryInfo, setFarmingSummaryInfo ] = useState({total_price: 0, prev_price: 0, minable_price: 0, rewarded_price: 0, avg_apr: 0}); 
  const [ stakingSummaryInfo, setStakingSummaryInfo ] = useState({total_price: 0, prev_price: 0, minable_price: 0, rewarded_price: 0, avg_apr: 0}); 

  const history = useHistory(); 
  const dispatch = useDispatch(); 

  React.useEffect(() => { 
    dispatch(auth()).then(res => { 
      if (res.payload.isAuth) { 
        const { name, _id } = res.payload; 
        
        setUserName(name);
        axios.get(`/api/wallets/${_id}`).then(res => res.data)
          .then(res => {
            if (res.result && res.result.length > 0) { 
              axios.get(`/api/wallets/${_id}/summary`, {params: {atype: 'asset'}})
                .then(res => res.data) 
                .then(res => { setAssetSummaryInfo(res.result); })

              axios.get(`/api/wallets/${_id}/summary`, {params: {atype: 'farming'}})
                .then(res => res.data) 
                .then(res => { setFarmingSummaryInfo(res.result); })

              axios.get(`/api/wallets/${_id}/summary`, {params: {atype: 'staking'}})
                .then(res => res.data) 
                .then(res => { setStakingSummaryInfo(res.result); })
            } else { 
              setEmpty(true); 
              return; 
            }
          }); 

        // axios.get(`/api/wallets/${_id}/summary`)
        //   .then(res => res.data) 
        //   .then(res => { 
        //     if (!res.status && res.result) {
        //       setEmpty(true); 
        //       return ;
        //     } 
        //     if (res.status) setSummaryInfo(res.result); 
        // })
      }
    })
  }, [])

  return ( 
    <>
      <Header />
      <Row>
        <Col style={{ marginTop: '20px', marginLeft: '10px', textAlign: 'left' }}>
          <h5 style={{ fontWeight: '600' }}>반가워요, {userName} 님</h5>
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
                <p style={{ margin: 'auto 0', color: '#F2F2F2', fontSize: '1.2em' }}> {
                    numberWithCommas(assetSummaryInfo.total_price+farmingSummaryInfo.total_price+stakingSummaryInfo.total_price)
                  } 원&nbsp;</p>
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
                <p style={{ margin: 'auto 0', color: '#F2F2F2', fontSize: '1.2em' }}> {
                    numberWithCommas(assetSummaryInfo.total_price+farmingSummaryInfo.total_price+stakingSummaryInfo.total_price)
                  } 원&nbsp;</p>
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
                <p style={{ margin: 'auto 0', color: '#F2F2F2', fontSize: '1.2em' }}>--- 원&nbsp;</p>
                <NavigateNextIcon style={{alignSelf:'center'}} />
              </span>
            </span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col style={{ margin: '20px 0' }}>
          <StackedBarChart 
            assetSummaryInfo={assetSummaryInfo}
            farmingSummaryInfo={farmingSummaryInfo}
            stakingSummaryInfo={stakingSummaryInfo}
           />
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
            {/* <div style={{ backgroundColor: '#DDE8FC', width: '31px', height: '31px', borderRadius: '50%', color: '#615EFF', fontWeight: 'bold' }}>₩</div>  */}
            <img src={KRW_icon} /> 
          </Col>
          <Col xs='3' style={{ padding:'0' ,fontWeight: '500', textAlign: 'left', display: 'flex', alignSelf: 'center'}}>
            지갑
          </Col>
          <Col xs='5' style={{padding: '0', alignSelf: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
              <span> {numberWithCommas(assetSummaryInfo.total_price)} 원</span>
              <span 
                class={assetSummaryInfo.total_price-assetSummaryInfo.prev_price ? 'rise' : 'drop'} 
                style={{fontSize: '12px'}}
              > {assetSummaryInfo.total_price-assetSummaryInfo.prev_price > 0 ? '+' : ''}
                {numberWithCommas(assetSummaryInfo.total_price-assetSummaryInfo.prev_price)}원 ({variationRatio(assetSummaryInfo.total_price, assetSummaryInfo.prev_price)}%)
              </span>
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
            {/* <div style={{ backgroundColor: '#FFE6B3', width: '31px', height: '31px', borderRadius: '50%', color: '#FFAF31', fontWeight: 'bold' }}>D</div>  */}
            <img src={D_icon} /> 
          </Col>
          <Col xs='3' style={{ padding:'0' ,fontWeight: '500', textAlign: 'left', display: 'flex', alignSelf: 'center'}}>
            디파이
          </Col>
          <Col xs='5' style={{padding: '0', alignSelf: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
            <span> {numberWithCommas(farmingSummaryInfo.total_price+stakingSummaryInfo.total_price)} 원</span>
            <span 
                class={farmingSummaryInfo.total_price-farmingSummaryInfo.prev_price + stakingSummaryInfo.total_price-stakingSummaryInfo.prev_price > 0 ? 'rise' : 'drop'} 
                style={{fontSize: '12px'}}
              > {farmingSummaryInfo.total_price-farmingSummaryInfo.prev_price+stakingSummaryInfo.total_price-stakingSummaryInfo.prev_price > 0 ? '+' : ''}
                {numberWithCommas(farmingSummaryInfo.total_price-farmingSummaryInfo.prev_price + stakingSummaryInfo.total_price-stakingSummaryInfo.prev_price)}원 ({variationRatio(farmingSummaryInfo.total_price+stakingSummaryInfo.total_price, farmingSummaryInfo.prev_price+stakingSummaryInfo.prev_price)}%)
            </span>
            </div>
          </Col>
          {/* <Col xs='2' style={{alignSelf: 'center', paddingRight: '0'}}>
            <NavigateNextIcon />
          </Col> */}
        </Row>


        <Row style={{ margin: '10px auto', height: '5rem'}}>
          <Col xs='2' style={{ alignSelf: 'center', padding: '0 0 0 1em'}}>
            {/* 아이콘으로 대체해야함 */}
            {/* <div style={{ backgroundColor: '#F2F2F2', width: '31px', height: '31px', borderRadius: '50%', color: '#BDBDBD', fontWeight: 'bold' }}>F</div>  */}
            <img src={F_icon} /> 
          </Col>
          <Col xs='3' style={{ padding:'0 0 0 1em' ,fontWeight: '500', textAlign: 'left', display: 'flex', alignSelf: 'center'}}>
            파밍
          </Col>
          <Col xs='5' style={{padding: '0', alignSelf: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
              <span> {numberWithCommas(farmingSummaryInfo.total_price)} 원</span>
              <span 
                  class={farmingSummaryInfo.total_price-farmingSummaryInfo.prev_price > 0 ? 'rise' : 'drop'} 
                  style={{fontSize: '12px'}}
                > {farmingSummaryInfo.total_price-farmingSummaryInfo.prev_price > 0 ? '+' : ''}
                  {numberWithCommas(farmingSummaryInfo.total_price-farmingSummaryInfo.prev_price)}원 ({variationRatio(farmingSummaryInfo.total_price, farmingSummaryInfo.prev_price)}%)
              </span>
              <span style={{fontSize: '12px', color: '#828282'}}>누적 리워드 : {numberWithCommas(farmingSummaryInfo.rewarded_price)} 원</span>
            </div>
          </Col>
          <Col xs='2' style={{alignSelf: 'center', paddingRight: '0', color: '#BDBDBD'}}>
            <NavigateNextIcon />
          </Col>
        </Row>

        <Row style={{ margin: '10px auto', height: '5rem'}}>
          <Col xs='2' style={{ alignSelf: 'center', padding: '0 0 0 1em'}}>
            {/* 아이콘으로 대체해야함 */}
            {/* <div style={{ backgroundColor: '#F2F2F2', width: '31px', height: '31px', borderRadius: '50%', color: '#BDBDBD', fontWeight: 'bold' }}>S</div>  */}
            <img src={S_icon} /> 
          </Col>
          <Col xs='3' style={{ padding:'0 0 0 1em' ,fontWeight: '500', textAlign: 'left', display: 'flex', alignSelf: 'center'}}>
            스테이킹
          </Col>
          <Col xs='5' style={{padding: '0', alignSelf: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
              <span> {numberWithCommas(stakingSummaryInfo.total_price)} 원</span>
              <span 
                  class={stakingSummaryInfo.total_price-stakingSummaryInfo.prev_price > 0 ? 'rise' : 'drop'} 
                  style={{fontSize: '12px'}}
                > {stakingSummaryInfo.total_price-stakingSummaryInfo.prev_price > 0 ? '+' : ''}
                  {numberWithCommas(stakingSummaryInfo.total_price-stakingSummaryInfo.prev_price)}원 ({variationRatio(stakingSummaryInfo.total_price, stakingSummaryInfo.prev_price)}%)
              </span>
              <span style={{fontSize: '12px', color: '#828282'}}>누적 리워드 : {numberWithCommas(stakingSummaryInfo.rewarded_price)} 원</span>
            </div>
          </Col>
          <Col xs='2' style={{ alignSelf: 'center', paddingRight: '0', color: '#BDBDBD' }}>
            <NavigateNextIcon />
          </Col>
        </Row>

        <Modal
          className="modalOnBottom"
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