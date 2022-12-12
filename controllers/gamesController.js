const axios = require("axios");
require('dotenv').config();

//unix time tables
//1hour 3600sec
//1day 86400
//1week 604800
//1month 2629743
//1year 31556926

//TODO: check if token is expired, if so update it

const {CLIENT_ID, CLIENT_SECRET} = process.env;

let tokenExperationTime;
let accessToken;

const getAccessToken = async()=>{
    try{
        // if(tokenExperationTime < currentTime)
        if(accessToken && !isTokenExpired())return;

        const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`

        const response = await axios.post(url);
        accessToken = response.data.access_token;
        tokenExperationTime = response.data.expires_in;

    }catch (e) {
        console.log(e);
    }
}

const isTokenExpired = ()=>{
    const currentTime = new Date().getTime();
    return currentTime < tokenExperationTime;
}


module.exports = {
    newGames: async (req, res)=>{
        try{
        await getAccessToken();
        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            {
                headers:{
                    'Client-ID': CLIENT_ID,
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'text/plain',
                },
            data:'fields release_dates.platform.*, release_dates.human, name; where release_dates.date > 1670020433 & release_dates.date<=1670620433;'
            },
        );
        res.json(response.data);
        }catch (e) {
            console.log(e);
        }

    },
    upcomingGames: async(req, res)=>{
        await getAccessToken();
    },
    popularGames: async(req, res)=>{
        await getAccessToken();
    }
}