import {format} from 'date-fns'
import axios from 'axios'

const getUtilizationReport = async(customerId,subscriptionId,endDate,startDate,showDetails,granularity) => {
  let showDetailsStatus = "True"
  if (!showDetails){
    showDetailsStatus = "False"
  }

  let URL = encodeURI(
    `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}/utilizations/azure?start_time=${format(startDate,"yyyy-MM-dd'T00:00:00-00:00'")}&end_time=${format(endDate,"yyyy-MM-dd'T00:00:00-00:00'")}&granularity=${granularity}&show_details=${showDetailsStatus}`              
  ) 
  
const response = await axios.get('/api/getAccessToken')
const token = response.data
let error = {}
let data = []

  try {
    let response = await axios.get(URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }      
    });
    data = data.concat(response.data.items)            
    while (response.data.links.next){
      response = await axios.get(`https://api.partnercenter.microsoft.com/v1/${response.data.links.next.uri}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'MS-ContinuationToken': response.data.links.next.headers[0].value
        }      
      });  
      data = data.concat(response.data.items)
    }    
    return ({data})
  } catch (e) { 
    console.error(e)
    if  (e.response){
    const err_data = e.response.data
    if (err_data.code === 3000){
      error = {description:err_data.description+". Please check the ID"}
    }    
    return ({error})        
  }  
}
}

export default getUtilizationReport