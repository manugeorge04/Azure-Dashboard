import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {AppBar, Drawer, Divider ,IconButton, List, ListItem, ListItemText, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: "25rem",      
  },
  listItem: {
    paddingTop: "1rem",
    paddingBottom: "1rem",
  },
  resize:{
    fontSize:'1.5rem'
  },
}));

const AppBarHeader = () => {
  const classes = useStyles();

  const [drawerStatus, setDrawerStatus] = useState(false)

  const toggleDrawer = (status) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return; //closes the drawer only if enter key is presssed after using the shift and tab      
      } // if shift and tab are pressed it makes sure the drawer isn't closed
      setDrawerStatus(status)
  };

  const DrawerList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
      <Divider/>
        <ListItem className={classes.listItem} button component={Link} to="/generatereport">          
          <ListItemText primaryTypographyProps={{ classes: { root: classes.resize } }} primary="Generate Utilzation Report" />
        </ListItem>
      <Divider/>  
        <ListItem className={classes.listItem}  button  component={Link} to="/myresources">          
          <ListItemText primaryTypographyProps={{ classes: { root: classes.resize } }} primary="My Resources" />
        </ListItem>
        <Divider/>
      </List>      
    </div>
  );
  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h3" className={classes.title}>
            Partner Centre Dashboard
          </Typography>              
          <IconButton            
           className={classes.menuButton}
           color="inherit"
           aria-label="menu"
           onClick={toggleDrawer(true)}
          >
            <MenuIcon fontSize="large" />
          </IconButton>          
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerStatus} onClose={toggleDrawer(false)}>
        <DrawerList/>
      </Drawer>
    </div>
  );
}

export default AppBarHeader
