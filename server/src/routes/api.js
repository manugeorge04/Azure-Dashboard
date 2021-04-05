var express = require('express');
var router = express.Router();
require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');

router.get('/api/getAccessToken', async (req, res) => {           
    let URL = encodeURI(
        `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/token`
    )
    let resource = encodeURI(
        `https://graph.windows.net&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`
    )   

    try{
        const response = await axios.post(URL,                    
            querystring.stringify({
                resource: "https://graph.windows.net",
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type:'client_credentials'
            })
        ,{
            headers: {
              'Content-Type':'application/x-www-form-urlencoded',                   
            }
          }
        )        
        res.send(response.data)               
    }catch (error) {
        console.error(error);
    }  
});

module.exports = router;