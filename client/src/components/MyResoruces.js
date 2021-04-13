import React, {useState} from 'react'
import {Button, CircularProgress, Grid, makeStyles, TextField} from '@material-ui/core'
import getMyResources from '../utils/getMyResources';
import ErrorAlert from '../components/ErrorAlert'

const useStyles = makeStyles((theme) => ({
  root1 : {
    margin: theme.spacing(2),    
  }, 
  root: {
    margin: theme.spacing(3),    
    flexGrow: 1,
    maxWidth: '900px',
    paddingRight: '12px'
  },
  list: {
    width: '100%',    
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  resize:{
    fontSize:'1.5rem'
  },
  submitButton:{
    minWidth: "120px",
    fontSize: "1.5rem",
    margin: "24px 0 0 16px"
  },
  textField: {
    margin: theme.spacing(2), 
    width: '41ch', 
  },
}))

const MyResources = () => {
  const classes = useStyles();

  const [loadingStatus, setLoadingStatus] = useState(false)

  const [customerIdEmpty, setCustomerIdStatus] = useState(false)
  const [subscriptionIdEmpty, setSubscriptionIdStatus] = useState(false)

  const [customerId, setCustomerId] = useState("")
  const [subscriptionId, setSubscriptionId] = useState("")

  const handleCustomerIdInput = (event) => {
    setCustomerId(event.target.value.trim())
  }
  const handleSubscriptionIdInput = (event) => {
    setSubscriptionId(event.target.value.trim())
  }

  const [alert, setAlert] = useState({
    status: false,
    message:"",
    severity:"",
    title:""
  })   

  const patt = new RegExp(/\b[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-\b[0-9a-fA-F]{12}\b$/);
  let allValidationPass = false

  const handleSubmit = () => {    
    setAlert({status:false}) 
    allValidationPass = true //if this stays true at the end of all the if statements then the PC api will be called    
    
    // check ID inputs  
    if (customerId === "" || !(patt.test(customerId))){
      setCustomerIdStatus(true)
      allValidationPass = false
    }else
      setCustomerIdStatus(false)
    if (subscriptionId === "" || !(patt.test(subscriptionId))){
      setSubscriptionIdStatus(true)  
      allValidationPass = false    
    }else 
      setSubscriptionIdStatus(false)   

    const submit = async() => {             
      const response = await getMyResources(customerId,subscriptionId) 
      if (response.error){
        setAlert({
          status:true,
          message: response.error.description,
          severity: "error",
          title:"Error"
        }) 
      }   
      setLoadingStatus(false)   //stop loading screen here     
       
    }

    //Submit form details all validations have passed
    if (allValidationPass){          
      setLoadingStatus(true)
      submit()  
      
    }
    
  }

  return(
    <div className = {classes.root1}>
    {alert.status && <ErrorAlert errorMessage={alert.message} title={alert.title} severity={alert.severity} handleClose={setAlert} />} 
      <div className={classes.root}>
        <h1> My Resources </h1>  

        <Grid container spacing={3} >
          <Grid item xs={12} sm={6}>
            <TextField
            className={classes.textField}
            required  
            error = {customerIdEmpty} 
            helperText={customerIdEmpty?"Please enter a valid Customer ID":""}     
            label="Enter Customer ID"           
            variant="outlined"
            disabled={loadingStatus}
            onChange={handleCustomerIdInput}
            InputProps={{ classes: { root: classes.resize } }}
            InputLabelProps={{classes: { root: classes.resize } }}
            />
          </Grid>        
          <Grid item xs={12} sm={6}>
            <TextField
            className={classes.textField}
            required        
            error = {subscriptionIdEmpty}
            label="Enter Subcription ID" 
            helperText={subscriptionIdEmpty?"Please enter a valid Subcription ID":""}
            variant="outlined"
            disabled={loadingStatus}
            onChange={handleSubscriptionIdInput}
            InputProps={{ classes: { root: classes.resize } }}
            InputLabelProps={{classes: { root: classes.resize } }}
            />
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" className={classes.submitButton} disabled={loadingStatus}
        onClick={handleSubmit}     
        >
          Submit
        </Button>  

        {loadingStatus && <CircularProgress className = "circularProgress" />}

      </div>
    </div>
  )
}

export default MyResources