import axios from 'axios'
import Cookies from 'js-cookie'

const getCompanyName = async (customerId) => {
    let URL = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}`
    let accessToken = Cookies.getJSON('accessToken')

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