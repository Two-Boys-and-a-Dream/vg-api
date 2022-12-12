const axios = require("axios");
require('dotenv').config();

const getAccessToken = async()=>{
    try{
        const {CLIENT_ID, CLIENT_SECRET} = process.env;
        const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
        const response = await axios.post(url);
        return response.data.access_token;
    }catch (e) {
        console.log(e);
    }
}

module.exports = {
    newGames: async (req, res)=>{
        const token = await getAccessToken();

        res.end();
    },
    upcomingGames: (req, res)=>{

    },
    popularGames: (req, res)=>{

    }
}