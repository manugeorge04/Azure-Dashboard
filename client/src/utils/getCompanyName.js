import axios from 'axios'
import Cookies from 'js-cookie'

const getCompanyName = async (customerId) => {
    let URL = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}`
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

    try {
        let response = await axios.get(URL, {
            headers: {
              'Authorization': `Bearer ${accessToken.tokenValue}`
            }      
          });        
        return response.data.companyProfile.companyName
    }catch (e){
        console.log(e)
    }
}

export default getCompanyName