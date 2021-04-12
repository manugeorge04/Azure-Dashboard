import React from 'react';
import {AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
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
}));

const AppBarHeader = () => {
  const classes = useStyles();
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
          >
            <MenuIcon fontSize="large" />
          </IconButton>          
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default AppBarHeader
