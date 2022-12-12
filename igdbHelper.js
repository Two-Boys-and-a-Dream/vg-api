require('dotenv').config()
const axios = require('axios')

const { CLIENT_ID, CLIENT_SECRET } = process.env

let tokenExperationTime
let accessToken

//sets token and timer, if token doesn't exist and/or is expired.
const getAccessToken = async () => {
    const currentTime = new Date().getTime()
    if (accessToken && currentTime < tokenExperationTime) return

    const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
    const response = await axios.post(url)

    accessToken = response.data.access_token
    tokenExperationTime = response.data.expires_in + currentTime
}

const Post = async (routeName) => {
    await getAccessToken()

    const data = formatData(routeName)
    const config = postConfig()
    return axios.post('https://api.igdb.com/v4/games', data, config)
}

module.exports = Post

//AXIOS CONFIG
//axios posts default config
const postConfig = () => {
    return {
        headers: {
            Accept: 'application/json',
            'Client-ID': `${CLIENT_ID}`,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'text/plain',
        },
    }
}

//AXIOS DATA OBJECTS
function formatData(dataType) {
    const currentTime = new Date().getTime()
    const startingTime = currentTime - 604800 //current time - a week in unix

    switch (dataType) {
        case 'new':
            return `fields release_dates.platform.*, release_dates.human, name; where release_dates.date > ${startingTime} & release_dates.date <= ${currentTime};`
        case 'upcoming':
            return `fields platforms.*, release_dates.human, name; where release_dates.date > ${currentTime};`
        case 'popular':
            return `fields platforms.*, release_dates.human, name, total_rating_count; where release_dates.date > ${startingTime} & release_dates.date <= ${currentTime} & total_rating_count > 20;`
        default:
            return
    }
}

//unix time tables
//1hour 3600sec
//1day 86400
//1week 604800
//1month 2629743
//1year 31556926
