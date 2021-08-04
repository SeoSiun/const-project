import React from 'react';

import { Row, Col } from 'react-bootstrap'; 
import { IconButton } from '@material-ui/core';
import Menu from '@material-ui/icons/Menu';

import logo_img from 'static/img/logo_img.png';

import './navbar.css'; 


function Header(props) {
  return  ( 
    <Row
      className='align-items-end'
      style={{
        height: '90px',
        paddingBottom: '10px'
      }}
    >
      <Col xs={2} style={{ height: '50px' }}>
        <img src={logo_img} style={{ height: '100%' }} alt='logo'/>
      </Col>
      <Col xs={{ span: 2, offset: 8 }} style={{ textAlign: 'right' }}>
        <IconButton color='black' component='span' size='large' >
          <Menu style={{fontSize: '120%'}} />
        </IconButton>
      </Col>
    </Row>
  )
}

export default Header;
