const axios = require("axios");
require("dotenv").config();

//unix time tables
//1hour 3600sec
//1day 86400
//1week 604800
//1month 2629743
//1year 31556926

const { CLIENT_ID, CLIENT_SECRET } = process.env;

let tokenExperationTime;
let accessToken;

const getAccessToken = async () => {
  const currentTime = new Date().getTime();

  if (accessToken && currentTime < tokenExperationTime) return;

  const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;

  const response = await axios.post(url);
  accessToken = response.data.access_token;
  tokenExperationTime = response.data.expires_in + currentTime;
};

module.exports = {
  newGames: async (req, res) => {
    try {
      await getAccessToken();

      const currentTime = new Date().getTime();
      const startingTime = currentTime - 604800;

      // const response = await axios({
      //     url: "https://api.igdb.com/v4/games",
      //     method: 'POST',
      //     headers:{
      //         'Accept': 'application/json',
      //         'Client-ID': CLIENT_ID,
      //         'Authorization': `Bearer ${accessToken}`,
      //         'Content-Type': 'text/plain'
      //     },
      //     data: `fields release_dates.platform.*, release_dates.human, name; where release_dates.date > ${startingTime} & release_dates.date<=${currentTime};`
      // });
      console.log({ accessToken });
      //   const response = await axios.post("https://api.igdb.com/v4/games", {
      //     headers: {
      //       accept: "application/json",
      //       "client-id": CLIENT_ID,
      //       authorization: `Bearer ${accessToken}`,
      //       //   "Content-Type": "text/plain",
      //     },
      //     // data: `fields release_dates.platform.*, release_dates.human, name; where release_dates.date > ${startingTime} & release_dates.date<=${currentTime};`,
      //   });

      const data = {
        data: `fields release_dates.platform.*, release_dates.human, name; where release_dates.date > ${startingTime} & release_dates.date<=${currentTime};`,
      };
      const config = {
        headers: {
          accept: "application/json",
          "client-id": CLIENT_ID,
          authorization: `Bearer ${accessToken}`,
          "Content-Type": "text/plain",
        },
      };
      const response = await axios.post(
        "https://api.igdb.com/v4/games",
        data,
        config
      );

      console.log(response);

      // res.json(response.data);
      res.send("wow");
    } catch (e) {
      console.log(e);
      res.status(400);
      res.end();
    }
  },
  upcomingGames: async (req, res) => {
    await getAccessToken();
  },
  popularGames: async (req, res) => {
    await getAccessToken();
  },
};
