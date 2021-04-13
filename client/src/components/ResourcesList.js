import React, { useState, useEffect } from 'react';
import {List, ListItem, ListItemText, Collapse, ListSubheader, makeStyles, StylesProvider } from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
    list: {
      width: '70%',    
      backgroundColor: '#F8F8FF',
      margin: theme.spacing(2), 
      borderRadius: "10px",         
    },
    nested1: {
      paddingLeft: theme.spacing(4),
    },
    nested2: {
      paddingLeft: theme.spacing(8),
    },
    listSubHeaderResize: {
      fontSize: "2rem"
    },
    resizeFont: {
      fontSize: "2rem"
    },
    resizeFont1: {
      fontSize: "1.7rem"
    },
    resizeFont2: {
      fontSize: "1.4rem"
    },
}));




const ResourcesList = (props) => {  
 
  const classes = useStyles()

  const listOfResources = props.listOfResources 

  const [open, setOpen] = useState({});

  const handleClick = (e) => {    
    setOpen((prevState) => ({
      ...prevState,
      [e.currentTarget.id]: !(prevState[e.currentTarget.id])
    }));
  };

  useEffect(() => { //set all the states after Mounting
    const state = {}
    Object.keys(listOfResources).map((RGName,RGN_index) => {
      state[RGN_index] = false      
      Object.keys(listOfResources[RGName]).map((RCategory,RC_index) =>{
        state[RGN_index+"_"+RC_index] = false          
      })
    })
    setOpen(state)        
  }, [listOfResources]); //reset states on new submit

  return (  
    <List       
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader classes={{root:classes.listSubHeaderResize}} component="div" id="nested-list-subheader">
          {`${props.companyName}: List of Resources`}
        </ListSubheader>
      }
      classes={{root:classes.list}}
    >
      {
        Object.keys(listOfResources).map((RGName,RGN_index) => 
          (    
            <React.Fragment key={RGN_index}>
              <ListItem button onClick={handleClick} id={RGN_index}>        
                <ListItemText primary={RGName} primaryTypographyProps={{ classes:{ root: classes.resizeFont }}} />
                {open[RGN_index] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open[RGN_index]} timeout="auto" unmountOnExit>
              {
                Object.keys(listOfResources[RGName]).map((RCategory,RC_index) =>(           
                  <React.Fragment key={RGN_index+"_"+RC_index}>                  
                    <ListItem button onClick={handleClick} id={RGN_index+"_"+RC_index} className={classes.nested1} >            
                      <ListItemText primary={RCategory} primaryTypographyProps={{ classes:{ root: classes.resizeFont1 }}}/>
                      {open[RGN_index+"_"+RC_index] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>                  
                  <Collapse in={open[RGN_index+"_"+RC_index]} timeout="auto" unmountOnExit>  
                  {
                    new Array(listOfResources[RGName][RCategory]).map((RName,RN_index) =>(  //This is a Set; so convert to array before performing map                         
                        <ListItem component="div" id={RGN_index+"_"+RC_index+"_"+RN_index} key={RGN_index+"_"+RC_index+"_"+RN_index} className={classes.nested2} >
                          <ListItemText primary={RName} primaryTypographyProps={{ classes:{ root: classes.resizeFont2 }}}/>                          
                        </ListItem>                      
                    ))
                  }  
                  </Collapse>
                  </React.Fragment>
                ))
              }
              </Collapse>
            </React.Fragment>
          )
        )    
      }           
    </List>
  );



  
}

export default ResourcesList