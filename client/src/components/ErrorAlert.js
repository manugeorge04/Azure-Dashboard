import React from 'react'
import { Alert, AlertTitle } from '@material-ui/lab';
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({   
    resize:{
        fontSize:'1.5rem'
      }
}))

const ErrorAlert = (props) => {
  const classes = useStyles();

  return(
      <div >
        <Alert 
        severity={props.severity}
        onClose={() => {
            props.handleClose({
                status:false                
              })
        }}
        className = {classes.resize}
        >
        <AlertTitle className = {classes.resize}>{props.title}</AlertTitle>
            {props.errorMessage}
        </Alert>
      </div>
  )
}

export default ErrorAlert