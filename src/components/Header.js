import React from 'react';
import { Link } from "react-router-dom"; 

import { Row, Col } from 'react-bootstrap'; 
import logo_img from 'static/img/logo_img.png';

import MenuBar from './MenuBar';
import './Header.css'; 


function Header(props) {
  return  ( 
    <Row
      className='align-items-end'
      style={{
        height: '90px',
        paddingBottom: '10px'
      }}
    >
      <Col xs={2} style={{ height: '40px' }}>
        <Link to="./dashboard">
          <img src={logo_img} style={{ height: '100%' }} alt='logo'/>
        </Link>
      </Col>
      <Col xs={{ span: 2, offset: 8 }} style={{ textAlign: 'right' }}>
        <MenuBar /> 
      </Col>
    </Row>
  )
}

export default Header;
