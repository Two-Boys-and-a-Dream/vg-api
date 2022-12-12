const axios = require("axios");
require('dotenv').config();

let tokenExperationTime;
let accessToken;

const getAccessToken = async()=>{
    try{
        const {CLIENT_ID, CLIENT_SECRET} = process.env;
        const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`

        const response = await axios.post(url);
        accessToken = response.data.access_token;
        tokenExperationTime = response.data.expires_in;

    }catch (e) {
        console.log(e);
    }
}


module.exports = {
    newGames: async (req, res)=>{
        if(!accessToken) await getAccessToken();


        res.end();
    },
    upcomingGames: async(req, res)=>{
        if(!accessToken) await getAccessToken();
    },
    popularGames: async(req, res)=>{
        if(!accessToken) await getAccessToken();
    }
}