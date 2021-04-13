import React, {useState} from 'react'
import {Button, CircularProgress, Grid, makeStyles, TextField} from '@material-ui/core'
import getMyResources from '../utils/getMyResources';
import ErrorAlert from '../components/ErrorAlert'
import ResourcesList from '../components/ResourcesList'
import getCompanyName from '../utils/getCompanyName'

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

  const [listOfResources, setlistOfResources] = useState(undefined)  // uncomment this before commit

  //testing object
  // const [listOfResources, setlistOfResources] = useState(
  //   {"zach23mar19":{"Storage":["zach23mar19diag466","zach23mar19diag"],"Virtual Network":["zgm-ip"],"Automation":["AutoStartStopZGM"]},"cloud-shell-storage-centralindia":{"Storage":["csgcaae85d33118x47cbx9a7"]},"digitaldesk-rg":{"Virtual Network":["digitaldesk-ip"],"Storage":["digitaldesk_OsDisk_1_6bc1f431f9744cb0bd6e05493d271e56"]},"asr-myvm-rg":{"Bandwidth":["ryac6basrmyvmvasrcache"],"Storage":["ryac6basrmyvmvasrcache"],"Azure Site Recovery":["asr-myvm-vault"],"Automation":["asr-myvm--2rq-asr-automationaccount"]},"ZACH23MAR19":{"Bandwidth":["zgm"],"Storage":["linuxvm_DataDisk_0","zgm_OsDisk_1_b2c3784853534037a0e911e0364716f8","linuxvm_OsDisk_1_9c882dc2b1fb4d1a96942d07c5b65139"],"Virtual Machines":["zgm"]},"ZACH23MAR19-ASR":{"Storage":["zgm_OsDisk_1_b2c3784853534037a0e911e0364716f8-ASRReplica"]},"LINUXFLASK":{"Storage":["linuxflaskvm_OsDisk_1_143046fc9f0c4a50919a75a8673388b9"],"Bandwidth":["linuxflaskvm"],"Virtual Machines":["linuxflaskvm"]},"azconsreport":{"Storage":["azconsreportstrg"]},"defaultresourcegroup-cin":{"Log Analytics":["defaultworkspace-caae85d3-3118-47cb-9a70-31154f2d8687-cin"]}}
  // )


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

  const [companyName, setCompanyName] = useState("") //change to empty before commiting

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
      setCompanyName(await getCompanyName(customerId))      
      setlistOfResources(response) 
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
        {listOfResources && <ResourcesList listOfResources={listOfResources} companyName={companyName}/>
        }
        {//<ResourcesList listOfResources={listOfResources} companyName={companyName}/>
        }
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