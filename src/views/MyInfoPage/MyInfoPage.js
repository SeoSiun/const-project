import React, {useState} from 'react'; 

import {Container, Row, Col, Button} from 'react-bootstrap'; 
import axios from 'axios'; 

import { useHistory } from 'react-router-dom'; 
import { useDispatch } from 'react-redux'; 
import { withRouter } from 'react-router';

import { auth } from '_actions/user_action'; 
import Header from 'components/Header'; 

import Divider from '@material-ui/core/Divider';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import user_default_img from 'static/img/user_icon/user_default.png'; 
import logout_img from 'static/img/user_icon/logout.png';
import wallet_img from 'static/img/user_icon/wallet.png';

import './MyinfoPage.css'


import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';



function MyInfoPage(props) {

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      border: 'none',
      borderRadius: '10px', 
      height: 'inherit'
    },
  }));
  const classes = useStyles();


  const dispatch = useDispatch(); 
  const history = useHistory(); 

  const [userName, setUserName] = useState(''); 
  const [userEmail, setUserEmail] = useState(''); 
  const [modalState, setModalState] = useState(false); 

  const handleModalOpen = () => { setModalState(true) };
  const handleModalClose = () => { setModalState(false) };

  React.useEffect(() => { 
    dispatch(auth()).then(res => { 
      if (res.payload.hasOwnProperty('name')) { 
        const { name, email } = res.payload; 
        setUserName(name);
        setUserEmail(email); 
      }
    })
  }, [])

  const logoutHandler = () => { 
    axios.get('/api/users/logout')
      .then(res => { 
        if (res.data.status == "success" || !res.data.isAuth) { 
          window.localStorage.clear(); 
          props.history.push('/')
          alert('로그아웃 되었습니다.')
        }else { 
          alert('Failed to Log Out!')
        }
      })
  }
  return ( 
    <>
      <Header /> 
      <Container>
        <Row 
          className="align-items-center"
          style={{
            height:'80px', 
            marginBottom: '10px', 
        }}>
          <Col xs={2}>
            <img src={user_default_img} />
          </Col>
          <Col style={{
            textAlign: 'left', 
            marginLeft: '10px'
          }}>
            <div style={{
              fontSize: '15px', 
              fontWeight: 'bold', 
              height: '30px'
            }}>{userName}</div>
            <div style={{
              fontSize: '12px'
            }}>{userEmail}</div>
          </Col>
        </Row>
      </Container>

      <div style={{
        position: 'absolute', 
        left: '0', 
        margin: '0 auto', 
        width: '100%', 
        height: '10px', 
        backgroundColor: '#F2F2F2'
      }}/>

      <Container>
        <Row 
          className='align-items-center'
          style={{
          textAlign: 'left', 
          marginTop: '20px',
          height: '60px'
        }}
          onClick={() => { history.push('/myinfo/wallet')}}
        >
          <Col xs={1}>
            <img src={wallet_img} />
          </Col>
          <Col>
            <span>지갑 관리</span>
          </Col>
          <Col style={{textAlign: 'right'}}>
            <ArrowForwardIosIcon style={{
              fontSize: '15px', 
              color: '#BDBDBD'}} 
            />
          </Col>
        </Row>
        <Divider />
        <Row 
          className='align-items-center'
          style={{
            textAlign: 'left', 
            height: '60px'
          }}
          onClick={handleModalOpen}
          >
          <Col xs={1}>
            <img src={logout_img} />
          </Col>
          <Col>
            <span>로그아웃</span>
          </Col>
          <Col style={{textAlign: 'right'}}>
            <ArrowForwardIosIcon style={{
              fontSize: '15px', 
              color: '#BDBDBD'}} 
            />
          </Col>
        </Row>
      </Container>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modalState}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalState}>
          <div className={classes.paper}>
            <Container style={{width: '100%'}}>
              <Row style={{height: '50px'}} className='align-items-center'>
                <Col style={{fontSize: '15px'}}>
                  진심 로그아웃 할꺼임?
                </Col>
              </Row>
              <Row style={{height: '50px'}} className='align-items-end'>
                <Col style={{padding: '0'}}>
                  <Button className='modal-button' onClick={handleModalClose}>
                    취소
                  </Button>
                </Col>
                <Col style={{padding: '0'}}>
                  <Button className='modal-button' onClick={logoutHandler}>
                    로그아웃
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default withRouter(MyInfoPage)