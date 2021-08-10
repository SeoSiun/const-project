import React from "react";
import axios from "axios";

import { withRouter, Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ClearIcon from "@material-ui/icons/Clear";

import { InputLabel, Checkbox, FormControl, Input } from "@material-ui/core";

import SwipeableViews from "react-swipeable-views";

import "./resetpassword_page.css";

class Resetpassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      email_check: false,
      name: "",
      auth_check: false,
      password: "",
      password_check: false,
      password_confirmed: "",
      password_confirmed_check: false,

      agree_clause_essential: false,
      agree_collect_personalinfo_essential: false,
      agree_all: false,
      stepIndex: 0,
    };
  }

  goBackPage = () => {
    this.props.history.goBack();
  };
  goLoginPage = () => {
    this.props.history.push("/signin");
  };

  // Step1 => 이메일 입력 Handler
  handleEmail = (e) => {
    let email = e.target.value;
    if (!email) {
      this.setState({ email_check: false, email: "" });
      return;
    }

    // 이메일 형식 확인(Regular Expression)
    const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (!email.match(emailRegex)) { return; }

    axios.get(`/api/users/checkEmail/${email}`)
        .then(res => res.data)
        .then(res => {
            if (!res.result) {
              // 사용가능한 이름
              this.setState({ email_check: true, email });
              return;
            }
            this.setState({ email_check: false, email });
          });
  };

  // Step2 => 인증번호 Handler
  handleAuth = (e) => {
    let auth = e.target.value;
    if (!auth) {
      this.setState({ auth_check: false, auth: "" });
      return;
    }

    // 공백없이 숫자 4자리
    const authRegex = /^[0-9]{4,4}$/;

    if (!auth.match(authRegex)) { return; }
    /* TODO : 인증번호 개발 후 api연동하기 */
    // axios.get(`/api/users/checkName/${auth}`)
    //     .then(res => res.data)
    //     .then(res => {
    //         if (!res.result) {
    //           // 사용가능한 이름
    //           this.setState({ auth_check: true, auth });
    //           return;
    //         }
    //         this.setState({ auth_check: false, auth });
    //       });
    this.setState({ auth_check: true, auth });
  };

  // Step3 => 비밀번호 입력 Handler
  handlePassword = (e) => {
    let password = e.target.value;
    if (!password || password.length < 6) {
      this.setState({ password_check: false, password: password });
      return;
    }
    this.setState({ password_check: true, password: password });
  };

  // Step3-1 => 비밀번호 재입력 Handler
  handlePasswordConfirmed = (e) => {
    let password_confirmed = e.target.value;
    const prev_password = this.state.password;

    if (password_confirmed !== prev_password) {
      this.setState({
        password_confirmed_check: false,
        password_confirmed: password_confirmed,
      });
      return;
    }
    this.setState({
      password_confirmed_check: true,
      password_confirmed: password_confirmed,
    });
  };

  // Step3-2 => 비밀번호 재설정 요청(비밀번호 재입력 이후 "계속하기" 버튼 클릭시 수행)
  submitResetPassword = () => {
    const {
      email,
      auth,
      password,
      agree_clause_essential,
      agree_collect_personalinfo_essential,
    } = this.state;

    let agree_section = {
      agree_clause_essential,
      agree_collect_personalinfo_essential,
    };

    const user_data = { email, auth, password, agree_section };

    axios
      .post("/api/users/signup", user_data)
      .then((res) => {
        if (res.data.status === "success") {
          this.handleNextStep();
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
        alert("오류가 발생하였습니다. 관리자에게 문의해 주세요");
      });
  };

  // Swipeable view Step Handler
  handleChangeStep = (stepIndex) => {
    this.setState({ stepIndex });
  };
  handleNextStep = () => {
    this.setState({ stepIndex: this.state.stepIndex + 1 });
  };
  handlePrevStep = () => {
    if (this.state.stepIndex > 0) {
      this.setState({ stepIndex: this.state.stepIndex - 1 });
      return;
    }
    this.props.history.goBack();
  };

  // Rendering
  render() {
    const {
      stepIndex, // 비밀번호 재설정 Step 화면 view Index
      email,
      email_check,
      auth,
      auth_check,
      password,
      password_check,
      password_confirmed,
      password_confirmed_check,
    } = this.state;

    let email_check_msg = email_check ? (
      <span className="success-msg">사용가능한 메일입니다.</span>
    ) : email ? (
      <span className="warning-msg">중복된 메일입니다.</span>
    ) : (
      <span style={{ fontSize: "12px" }}>&nbsp;</span>
    );

    let auth_check_msg = auth_check ? (
      <span className="success-msg"></span>
    ) : auth ? (
      <span className="warning-msg">잘못된 인증번호입니다.</span>
    ) : (
      <span style={{ fontSize: "12px" }}>&nbsp;</span>
    );

    let password_check_msg = <span style={{ fontSize: "12px" }}>&nbsp;</span>;
    if (password_check) {
      password_check_msg = (
        <span className="success-msg">사용가능한 비밀번호입니다.</span>
      );
    } else if (0 < password.length && password.length < 6) {
      password_check_msg = (
        <span className="warning-msg">6자리 이상 입력해 주세요.</span>
      );
    }

    let password_confirmed_check_msg = password_confirmed_check ? (
      <span className="success-msg">사용가능한 비밀번호입니다.</span>
    ) : password_confirmed ? (
      <span className="warning-msg">비밀번호가 일치하지 않습니다.</span>
    ) : (
      <span style={{ fontSize: "12px" }}>&nbsp;</span>
    );

    let arrow_back_icon;
    const LAST_STEP = 5;
    if (stepIndex < LAST_STEP) {
      arrow_back_icon = <ArrowBackIosIcon onClick={this.handlePrevStep} />;
    }

    let next_button_box;
    switch (stepIndex) {
      case 0:
        next_button_box = (
          <Button
            className="next-button"
            style={{
              backgroundColor: email_check ? "#615EFF" : "#BDBDBD",
              borderColor: email_check ? "#615EFF" : "#BDBDBD",
            }}
            block
            disabled={!email_check}
            onClick={this.handleNextStep}
          >
            계속하기
          </Button>
        );
        break;
      case 1:
        next_button_box = (
          <Button
            className="next-button"
            style={{
              backgroundColor: auth_check ? "#615EFF" : "#BDBDBD",
              borderColor: auth_check ? "#615EFF" : "#BDBDBD",
            }}
            block
            disabled={!auth_check}
            onClick={this.handleNextStep}
          >
            계속하기
          </Button>
        );
        break;
      case 2:
        next_button_box = (
          <Button
            className="next-button"
            style={{
              backgroundColor: password_check ? "#615EFF" : "#BDBDBD",
              borderColor: password_check ? "#615EFF" : "#BDBDBD",
            }}
            block
            disabled={!password_check}
            onClick={this.handleNextStep}
          >
            계속하기
          </Button>
        );
        break;
      case 3:
        next_button_box = (
          <Button
            className="next-button"
            style={{
              backgroundColor: password_confirmed_check ? "#615EFF" : "#BDBDBD",
              borderColor: password_confirmed_check ? "#615EFF" : "#BDBDBD",
            }}
            block
            disabled={!password_confirmed_check}
            onClick={this.submitResetPassword}
          >
            계속하기
          </Button>
        );
        break;
      default:
        next_button_box = (
          <Link to="/signin">
            <Button
              className="next-button"
              style={{
                backgroundColor: "#615EFF",
                borderColor: "#615EFF",
              }}
            >
              로그인
            </Button>
          </Link>
        );
        break;
    }

    return (
      <Container style={{ padding: "0px" }}>
        <Row
          className="align-items-start"
          style={{ height: "120px", paddingTop: "30px" }}
        >
          <Col style={{ textAlign: "start" }}>{arrow_back_icon}</Col>
          <Col style={{ textAlign: "end" }}>
            <CloseIcon onClick={this.goBackPage} />
          </Col>
        </Row>
        <Row style={{ textAlign: "center", padding: "0 20px 0 20px" }}>
          <SwipeableViews
            index={stepIndex}
            onChangeIndex={this.handleChangeStep}
            style={{paddingLeft:"0", paddingRight:"0"}}
          >
            {/* Step1 => 이메일 입력 */}
           <div style={{overflow:"hidden"}}>
              <Row
                style={{
                  paddingTop: "20px",
                  textAlign: "left",
                  paddingBottom: "10px"
                }}
              >
                <Col>
                  <span
                    style={{
                      fontSize: "19px",
                      fontWeight: "bold",
                    }}
                  >
                    이메일을 입력해 주세요
                  </span>
                </Col>
              </Row>
              <Row
                style={{
                  textALign: "center",
                  paddingTop: "10px",
                }}
              >
                <Col>
                  <div className="input-box">
                    <FormControl fullWidth={true} style={{ width: "calc(100% - 50px)" }}>
                      <InputLabel style={{ padding: "5px 0 0 8px" }}>
                        이메일
                      </InputLabel>
                      <Input
                        disableUnderline={true}
                        placeholder="example@mail.com"
                        style={{ padding: "0 0 5px 8px" }}
                        onChange={this.handleEmail}
                      ></Input>
                    </FormControl>
                    <div style={{ float: "right", padding: "6px 0" }}>
                      <IconButton aria-label="clearIcon" component="span">
                        <ClearIcon />
                      </IconButton>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row style={{ textAlign: "left" }}>
                <Col>{email_check_msg}</Col>
              </Row>
            </div>

            {/* TODO: Step2-1 => 이메일 인증 작업 */}

            {/* Step2 => 인증번호 입력 */}
            <div style={{overflow:"hidden"}}>
              <Row
                style={{
                  paddingTop: "20px",
                  textAlign: "left",
                  paddingBottom: "10px",
                }}
              >
                <Col>
                  <span
                    style={{
                      fontSize: "19px",
                      fontWeight: "bold",
                    }}
                  >
                    이메일로 전송된 인증번호를 입력해주세요.
                  </span>
                </Col>
              </Row>
              <Row
                style={{
                  textALign: "center",
                  paddingTop: "10px",
                }}
              >
                <Col>
                  <div className="input-box">
                    <FormControl fullWidth={true} style={{ width: "calc(100% - 50px)" }}>
                      <InputLabel style={{ padding: "5px 0 0 8px" }}>
                        인증번호 4자리
                      </InputLabel>
                      <Input
                        disableUnderline={true}
                        style={{ padding: "0 0 5px 8px" }}
                        onChange={this.handleAuth}
                      ></Input>
                    </FormControl>
                    <div style={{ float: "right", padding: "6px 0" }}>
                      <IconButton aria-label="clearIcon" component="span">
                        <ClearIcon />
                      </IconButton>
                    </div>
                  </div>
                  <div style={{fontSize:"12px", color:"#828282", marginTop:"50px"}}>
                  인증번호를 받지 못하셨나요?<span style={{paddingLeft:"10px"}}>재발송</span>
                  </div>
                </Col>
              </Row>
              <Row style={{ textAlign: "left" }}>
                <Col>{auth_check_msg}</Col>
              </Row>
            </div>

            {/* Step3 => 비밀번호 재설정 입력 */}
            <div style={{overflow:"hidden"}}>
              <Row
                style={{
                  paddingTop: "20px",
                  textAlign: "left",
                  paddingBottom: "10px",
                }}
              >
                <Col>
                  <span
                    style={{
                      fontSize: "19px",
                      fontWeight: "bold",
                    }}
                  >
                    새로운 비밀번호를 설정해주세요.
                  </span>
                </Col>
              </Row>
              <Row
                style={{
                  textALign: "center",
                  paddingTop: "10px",
                }}
              >
                <Col>
                  <div className="input-box">
                    <FormControl fullWidth={true} style={{ width: "calc(100% - 100px)" }}>
                      <InputLabel style={{ padding: "5px 0 0 8px" }}>
                        비밀번호 6자리 이상
                      </InputLabel>
                      <Input
                        disableUnderline={true}
                        type="password"
                        style={{ padding: "0 0 5px 8px" }}
                        onChange={this.handlePassword}
                      ></Input>
                    </FormControl>
                    <div style={{ float: "right", padding: "6px 0" }}>
                    <IconButton aria-label="visibilityIcon" component="span">
                      <VisibilityIcon />
                    </IconButton>
                      <IconButton aria-label="clearIcon" component="span">
                        <ClearIcon />
                      </IconButton>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row style={{ textAlign: "left" }}>
                <Col>{password_check_msg}</Col>
              </Row>
            </div>

            {/* Step3-1, Step3-2 => 비밀번호 재입력 이후 로그인 요청 */}
            <div style={{overflow:"hidden"}}>
              <Row
                style={{
                  paddingTop: "20px",
                  textAlign: "left",
                  paddingBottom: "10px",
                }}
              >
                <Col>
                  <span
                    style={{
                      fontSize: "19px",
                      fontWeight: "bold",
                    }}
                  >
                    비밀번호를 한번 더 입력해 주세요
                  </span>
                </Col>
              </Row>
              <Row
                style={{
                  textALign: "center",
                  paddingTop: "10px",
                }}
              >
                <Col>
                  <div className="input-box">
                    <FormControl fullWidth={true} style={{ width: "calc(100% - 100px)" }}>
                      <InputLabel style={{ padding: "5px 0 0 8px" }}>
                        비밀번호
                      </InputLabel>
                      <Input
                        disableUnderline={true}
                        type="password"
                        style={{ padding: "0 0 5px 8px" }}
                        onChange={this.handlePasswordConfirmed}
                      ></Input>
                    </FormControl>
                    <div style={{ float: "right", padding: "6px 0" }}>
                    <IconButton aria-label="visibilityIcon" component="span">
                      <VisibilityIcon />
                    </IconButton>
                      <IconButton aria-label="clearIcon" component="span">
                        <ClearIcon />
                      </IconButton>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row style={{ textAlign: "left" }}>
                <Col>{password_confirmed_check_msg}</Col>
              </Row>
            </div>

            {/* Step4 => 비밀번호 변경 완료 */}
            <div style={{overflow:"hidden"}}>
              <Row
                style={{
                  paddingTop: "20px",
                  textAlign: "left",
                  paddingBottom: "10px",
                }}
              >
                <Col>
                  <span
                    style={{
                      fontSize: "19px",
                      fontWeight: "bold",
                    }}
                  >
                    비밀번호 변경 완료
                  </span>
                </Col>
              </Row>
              <div
                style={{
                  paddingTop: "15px",
                  textAlign: "left",
                  height: "450px",
                }}
              >
                <Row
                  className="align-items-center"
                  style={{
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <Col>
                    <span style={{ fontSize: "13px" }}>
                    비밀번호 변경이 완료되었습니다.
                    </span>
                  </Col>
                </Row>
              </div>
            </div>
          </SwipeableViews>
          <Col>{next_button_box}</Col>
        </Row>
        {/* <Row className="next-button-box">
          
        </Row> */}
      </Container>
    );
  }
}

export default withRouter(Resetpassword);
