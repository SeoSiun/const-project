import React, { useRef } from "react";
import ReactDom from "react-dom";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { withRouter } from "react-router";
import './Modal.css'

export const Modal = ({ setShowModal }) => {
  // close the modal when clicking outside the modal.
  const modalRef = useRef();
  const closeModal = (e) => {
    if (e.target === modalRef.current) {
      setShowModal(false);
    }
  };

  return ReactDom.createPortal(
    <div className="container" ref={modalRef} onClick={closeModal}>
      <div className="modal">
        <h2>This is a Modal</h2>
        <button onClick={() => setShowModal(false)}>X</button>
      </div>
    </div>,
    document.getElementById("portal")
  );

  // render the modal JSX in the portal div.
  return ReactDom.createPortal(
      /*
    <div className="modal" 
        ref={modalRef} 
        onClick={closeModal}
        backdrop="static"
        keyboard={false}
        onHide={() => { setShowModal(false) }}>
        <div className="header">투표관리</div>
        <div className="body">
            <Row>
                <Col xs={{ span: 5, offset: 1}}>
                    <Button className="modal_button" onClick = {(setShowModal(true))}>
                        <p style={{ flex: "1", textAlign: "center" }}>투표하기</p>
                    </Button>
                </Col>
                <Col xs={{ span: 5, offset: 0}}>
                    <Button className="modal_button" onClick = {(setShowModal(true))}>
                    <p style={{ flex: "1", textAlign: "center" }}>철회하기</p>
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
                  onClick={() => { setShowModal(true) }}
                >
                  <div className="stacking-button">
                    <p style={{ flex: "1", textAlign: "center" }}>리워드 받기</p>
                  </div>
                </Button>
                </Col>
            </Row>
        </div>
        </div>,
        */

        <div className="container" ref={modalRef} onClick={closeModal}>
      <div className="modal">
        <h2>This is a Modal</h2>
        <button onClick={() => setShowModal(false)}>X</button>
      </div>
    </div>,
        document.getElementById("portal")
  );
};


