
import React, { useState } from "react";

import { Offcanvas } from "react-bootstrap";
import { IconButton } from "@material-ui/core";
import Menu from '@material-ui/icons/Menu';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from 'react-router-dom'; 


function MenuBar(props) {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));
  const history = useHistory(); 

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true);;

  return (
    <>
      <IconButton color="black" component="span" size="large" onClick={handleShow} >
        <Menu style={{fontSize: '120%'}} />
      </IconButton>
      <Offcanvas style={{width:"300px"}} show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Body>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            <ListItem button onClick={ () => { history.push('/portfolio'); }}>
              <ListItemText primary="홈"  style={{fontWeight:"700"}}/>
              <ListItemIcon>
                <NavigateNextIcon />
              </ListItemIcon>
              
            </ListItem>
            <hr/>
            <ListItem>
              <ListItemText primary="포트폴리오" style={{fontWeight:"700"}}/>
            
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested} >
                  <ListItemText primary="종합 요약" />
                  <ListItemIcon>
                    <NavigateNextIcon />
                  </ListItemIcon>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="지갑" />
                  <ListItemIcon>
                    <NavigateNextIcon />
                  </ListItemIcon>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="파밍" />
                  <ListItemIcon>
                    <NavigateNextIcon />
                  </ListItemIcon>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="스테이킹" />
                  <ListItemIcon>
                    <NavigateNextIcon />
                  </ListItemIcon>
                </ListItem>
              </List>
            </Collapse>
            <hr/>
            <ListItem>
              <ListItemText primary="DeFi"   style={{fontWeight:"700"}}/>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="스왑" />
                  <ListItemIcon>
                    <NavigateNextIcon />
                  </ListItemIcon>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="유동성 공급" />
                  <ListItemIcon>
                <NavigateNextIcon />
              </ListItemIcon>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="스테이킹" />
                  <ListItemIcon>
                    <NavigateNextIcon />
                  </ListItemIcon>
                </ListItem>
              </List>
            </Collapse>
            <hr/>
            <ListItem button onClick={ () => { history.push('/myinfo'); }} >
              <ListItemText primary="내 정보"  style={{fontWeight:"700"}}/>
              <ListItemIcon>
                <NavigateNextIcon />
              </ListItemIcon>
            </ListItem>
          </List>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MenuBar; 