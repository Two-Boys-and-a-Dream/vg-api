require("dotenv").config();
const axios = require("axios");

const { CLIENT_ID, CLIENT_SECRET } = process.env;

let tokenExperationTime;
let accessToken;

//sets token and timer, if token doesn't exist and/or is expired.
const getAccessToken = async () => {
  const currentTime = new Date().getTime();

  if (accessToken && currentTime < tokenExperationTime) return;

  const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;

  const response = await axios.post(url);

  accessToken = response.data.access_token;
  tokenExperationTime = response.data.expires_in + currentTime;
};

const reusableAxiosPost = async () => {
  await getAccessToken();

  const response = await axios.post(
    "https://api.igdb.com/v4/games",
    newReleasesPostData(),
    newReleasesPostConfig()
  );
  console.log(response);
  return response;
};

module.exports = reusableAxiosPost;

//axios posts default config
const newReleasesPostConfig = () => {
  return {
    headers: {
      Accept: "application/json",
      "Client-ID": `${CLIENT_ID}`,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
  };
};

//axios data object for new releases post request
const newReleasesPostData = () => {
  console.log("new release post data func");
  const currentTime = new Date().getTime();
  const startingTime = currentTime - 604800; //current time - a week in unix

  return `fields release_dates.platform.*, release_dates.human, name;
    where release_dates.date > ${startingTime} & release_dates.date<=${currentTime};`;
};

//unix time tables
//1hour 3600sec
//1day 86400
//1week 604800
//1month 2629743
//1year 31556926
