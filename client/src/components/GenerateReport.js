import React, { useState } from 'react'
import {Button, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, makeStyles, MenuItem, Select, Switch, TextField} from '@material-ui/core'
import {compareDesc, sub, differenceInCalendarDays} from 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers'
import ErrorAlert from "./ErrorAlert"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),    
    flexGrow: 1,
    maxWidth: '900px',
    paddingRight: '12px'
  },
  textField: {
    margin: theme.spacing(2), 
    width: '49ch', 
  },
  resize:{
    fontSize:'1.5rem'
  },
  resizeLabel:{
    fontSize:'1.5rem',
    paddingLeft:'16px'
  },
  datePicker: {
    paddingLeft:'16px'
  },
  switch: {
    paddingTop: "24px"
  },
  formControl: {
    paddingLeft: "16px" ,
    minWidth: "120px"   
  },
  submitButton:{
    minWidth: "120px",
    fontSize: "1.5rem",
    margin: "24px 0 0 16px"
  }
  
}));

const GenerateReport = () => {
  const classes = useStyles();

  let todayDate = new Date()
  const [endDate, setEndDate] = useState(todayDate);
  const [startDate, setStartDate] = useState( sub( todayDate, { months: 1 }));
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };  
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const [status, setStatus] = useState(true);
  const handleChange = () => {
    setStatus((prev) => !prev);
  };

  const [granularity,  setGranularity] = useState('daily');
  const handleGranularityChange = (event) => {
    setGranularity(event.target.value);
  };

  const [alert, setAlert] = useState({
    status: false,
    message:"",
    severity:"",
    title:""
  }) 
  
  

  const [customerIdEmpty, setCustomerIdStatus] = useState(false)
  const [subscriptionIdEmpty, setSubscriptionIdStatus] = useState(false)

  const [customerId, setCustomerId] = useState("")
  const [subscriptionId, setSubscriptionId] = useState("")

  const handleCustomerIdInput = (event) => {
    setCustomerId(event.target.value)
  }
  const handleSubscriptionIdInput = (event) => {
    setSubscriptionId(event.target.value)
  }

  const patt = new RegExp(/\b[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-\b[0-9a-fA-F]{12}\b$/);
  let allValidationPass = false

  const handleSubmit = () => { 
    allValidationPass = true //if this stays true at the end of all the if statements then the PC api will be called
    
    //check start date < end date 
    if (compareDesc(startDate, endDate) !== 1){      
      setAlert({
        status:true,
        message: "Please make sure start date is atleast 1 day before the end date",
        severity: "error",
        title:"Error"
      })
      allValidationPass = false
    }

    // check ID inputs  
    if (customerId === "" || !(patt.test(customerId.trim()))){
      setCustomerIdStatus(true)
      allValidationPass = false
    }else
      setCustomerIdStatus(false)
    if (subscriptionId === "" || !(patt.test(subscriptionId.trim()))){
      setSubscriptionIdStatus(true)  
      allValidationPass = false    
    }else 
      setSubscriptionIdStatus(false)

    //Warn if difference is more than 30 days    
    if (differenceInCalendarDays(endDate, startDate) > 31){      
      setAlert({
        status:true,
        message: "The requested data is for more than 30 days, report generation might take a while. Please wait.",
        severity: "info",
        title:"Please Note"
      })      
    }

    //Send a Get request to partner center  
    if (allValidationPass){
      //get request to partner center
    }
  }


  return(          
    <div className={classes.root}>    
      {alert.status? <ErrorAlert errorMessage={alert.message} title={alert.title} severity={alert.severity} handleClose={setAlert} /> : undefined}
      <h1> Generate Customer Utilization Report</h1>    
      <Grid container spacing={3} >
        <Grid item xs={12} sm={6}>
          <TextField
          className={classes.textField}
          required  
          error = {customerIdEmpty} 
          helperText={customerIdEmpty?"Please enter a valid Customer ID":""}     
          label="Enter Customer ID"           
          variant="outlined"
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
          onChange={handleSubscriptionIdInput}
          InputProps={{ classes: { root: classes.resize } }}
          InputLabelProps={{classes: { root: classes.resize } }}
          />
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={12} sm={6} >
            <KeyboardDatePicker
            className={classes.datePicker}
            margin="none"                      
            label="Enter Start Date"
            format="MM/dd/yyyy"
            disableFuture="true"
            value={startDate}
            onChange={handleStartDateChange}
            inputVariant="outlined"
            InputProps={{ classes: { root: classes.resize } }}
            InputLabelProps={{classes: { root: classes.resizeLabel } }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          </Grid>
          <Grid item xs={12} sm={6} >
            <KeyboardDatePicker     
            className={classes.datePicker}     
            margin="none"          
            label="Enter End Date"
            format="MM/dd/yyyy"
            disableFuture="true"
            value={endDate}
            onChange={handleEndDateChange}
            inputVariant="outlined"
            InputProps={{ classes: { root: classes.resize } }}
            InputLabelProps={{classes: { root: classes.resizeLabel } }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          </Grid>
        </MuiPickersUtilsProvider>

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel className={classes.resizeLabel}>Granularity</InputLabel>
            <Select         
              value={granularity}
              onChange={handleGranularityChange}
              label="Granularity"
              className={classes.resize}
            >                            
              <MenuItem value="daily" className={classes.resize}>Daily</MenuItem>
              <MenuItem value="hourly" className={classes.resize}>Hourly</MenuItem>           
            </Select>
          </FormControl>  
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormGroup row >
            <FormControlLabel 
            classes={{ 
              root:classes.switch ,
              label: classes.resize 
            }}
            control={
              <Switch
                checked={status}
                onChange={handleChange}
                color="primary"          
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Show Details"
            labelPlacement="start"          
            />
          </FormGroup>             
        </Grid>                
      </Grid> 

      <Button variant="contained" color="primary" className={classes.submitButton}
      onClick={handleSubmit}     
      >
        Submit
      </Button>      
    </div>
  )
}
export default GenerateReport