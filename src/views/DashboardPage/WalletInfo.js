import React from 'react'; 

import {Row, Col, Button} from 'react-bootstrap'; 

import { withRouter } from 'react-router';

import DoughnutChart from 'components/charts/DoughnutChart'; 
import klaytn_img from 'static/img/token_icon/klaytn_logo.png'; 
import bsc_img from 'static/img/token_icon/bsc_logo.png'; 



function WalletInfo(props) {

  const {balance, atype} = props;
  // const [ tokens, setTokens ] = useState([
  //   { amount: '4,662.7712',
  //     currentPrice: '1,198원',
  //     evaluatedPrice: '5,860,000원',
  //   },
  //   { amount: '4,662.7712',
  //     currentPrice: '1,198원',
  //     evaluatedPrice: '5,860,000원'
  //   },
  // ]);

  console.log("balance: ", balance); 

  return ( 
      <div style={{ width: '90%', margin: '10px auto 10px auto' }}>
        <Row style={{height: '40px'}}>
          <Col xs={1}>
            {atype == 'Klaytn' ? <img src={klaytn_img} /> : <img src={bsc_img} />}
          </Col>
          <Col> 
              {atype == 'Klaytn' ? 
                <span style={{fontSize: '15px', fontWeight: 'bold'}}>KLAY</span> : 
                <span style={{fontSize: '15px', fontWeight: 'bold'}}>KSP</span>
              }
              <div style={{
                margin: '0 0 0 10px',
                padding: '1px 3px',
                fontSize: '12px',
                display: 'inline',
                color: '#615EFF',
                borderRadius: '5px'
              }}>▾ 89.30 %</div>
          </Col>
          <Col align='right'>
            <Button 
              className="font-size-resolver"
              style={{
                width: 'auto',
                marginRight: '0',
                color: '#828282', 
                backgroundColor: '#F2F2F2',
                border: 'none',
                borderRadius: '1px',
                padding: '3px 10px'
              }}
            >
              Trade
            </Button>
          </Col>
        </Row>
        {/* <div style={{
          height: '200px'
        }}>
          <DoughnutChart data={balance.tokens}/>
        </div> */}

        <Row style={{ fontSize: '14px' }}>
          <Col>
            <p style={{ color: '#828282' }}>보유 수량</p>
          </Col>
          <Col>
            <p style={{ textAlign: 'right'}}>4,662.7712</p>
          </Col>
        </Row>

        <Row style={{ fontSize: '14px' }}>
          <Col>
            <p style={{ color: '#828282' }}>현재가</p>
          </Col>
          <Col>
            <p style={{ textAlign: 'right'}}>1,198원</p>
          </Col>
        </Row>

        <Row style={{ fontSize: '14px' }}>
          <Col>
            <p style={{ color: '#828282' }}>평가 금액</p>
          </Col>
          <Col>
            <p style={{ textAlign: 'right'}}>5,860,000원</p>
          </Col>
        </Row>
      </div>
  )
}

export default withRouter(WalletInfo)