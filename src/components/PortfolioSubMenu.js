import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; 

import { Row, Col } from 'react-bootstrap'; 



function PortfolioSubMenu(props) {
  
  const menuOptions = [ 
    { title: "요약", path: "summary" },
    { title: "지갑", path: "wallet" },
    { title: "파밍", path: "summary" },
    { title: "스테이킹", path: "staking" },
  ];

  const history = useHistory(); 

  const [ currentMenuIndex, setCurrentMenuIndex ] = useState(0);

  useEffect(() => {
    let menuIndex = props.menuIndex || 0;
    setCurrentMenuIndex(menuIndex)
  });  

  return (
    <>
      <Row style={{ fontSize: '1.2em', padding: '15px' }}>
        { menuOptions.map((menu, index) => {
          return <Col
            xs={2}
            style={ currentMenuIndex === index ? { width: 'fit-content', height: 'fit-content', backgroundColor: '#615EFF', color: 'white', borderRadius: '17px', fontWeight: 'bold' } : { width: 'fit-content', height: 'fit-content' } }
            key={menu.path} 
            onClick={() => history.push(`/portfolio/${menu.path}`)}
            >{menu.title}</Col>
        }) }
      </Row>
    </>
  );
}

export default PortfolioSubMenu;