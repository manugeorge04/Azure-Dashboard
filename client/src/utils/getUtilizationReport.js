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

  try {
    const response = await axios.get(URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }  
}

export default getUtilizationReport