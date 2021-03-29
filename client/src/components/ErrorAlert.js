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
        severity="error"
        onClose={() => {
            props.handleClose({
                status:false,
                message: ""
              })
        }}
        className = {classes.resize}
        >
        <AlertTitle className = {classes.resize}>Error</AlertTitle>
            {props.errorMessage}
        </Alert>
      </div>
  )
}

export default ErrorAlert