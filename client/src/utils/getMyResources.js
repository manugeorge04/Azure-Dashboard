import {format, sub} from 'date-fns'
import axios from 'axios'
import Cookies from 'js-cookie'

const getMyResources = async (customerId, subscriptionId) => {

    const todayDate = new Date()   
    const endDate = sub( todayDate, { days: 1 })    
    const startDate = sub( endDate, { days: 3 })    

    let URL = encodeURI(
        `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}/utilizations/azure?start_time=${format(startDate,"yyyy-MM-dd'T00:00:00-00:00'")}&end_time=${format(endDate,"yyyy-MM-dd'T00:00:00-00:00'")}&granularity=daily&show_details=True`              
    ) 

    let accessToken = Cookies.getJSON('accessToken')
    if (!accessToken || accessToken.tokenExpiry < ((Date.now()/1000) + 60 )) //+60 makes sure the token is valid for atleast one more minute
    {  
    const response = await axios.get('/api/getAccessToken')
    accessToken = { 
        tokenValue : response.data.access_token,
        tokenExpiry: response.data.expires_on
    }
    Cookies.set('accessToken', accessToken, {expires : 30 });
    }

    let error = {}
    let data = []
    const listOfResources = {}
    let RGName = ""
    let RCategory = ""
    let RName = ""


    try {
        let response = await axios.get(URL, {
          headers: {
            'Authorization': `Bearer ${accessToken.tokenValue}`
          }      
        });

        data = data.concat(response.data.items)            

        while (response.data.links.next){
          response = await axios.get(`https://api.partnercenter.microsoft.com/v1/${response.data.links.next.uri}`, {
            headers: {
              'Authorization': `Bearer ${accessToken.tokenValue}`,
              'MS-ContinuationToken': response.data.links.next.headers[0].value
            }      
          });  
          data = data.concat(response.data.items)
        }

        data.forEach( (item) => {
          RGName = item.instanceData.resourceUri.split("/")[4]
          RCategory = item.resource.category
          RName = item.instanceData.resourceUri.split("/")[8]

          if (RGName in listOfResources){
            if (RCategory in listOfResources[RGName]){
              listOfResources[RGName][RCategory].add(RName)
            }else{ //RCategory not in listOfResources so create one and add the name            
              listOfResources[RGName][RCategory] = new Set()
              listOfResources[RGName][RCategory].add(RName)
            }
          }else { //RGName not in listOfResources so create and then add the rest i.e Category and then Name
            listOfResources[RGName] = {}
            listOfResources[RGName][RCategory] = new Set()
            listOfResources[RGName][RCategory].add(RName)
          }          
        })

        return (listOfResources)
    }catch (e) { 
        console.error(e)
        if  (e.response){
            const err_data = e.response.data
            if (err_data.code === 3000){
                error = {description:err_data.description+". Please check the ID"}
            } 
            //console.log("error")   
            return ({error})   
        }
    }
}

export default getMyResources