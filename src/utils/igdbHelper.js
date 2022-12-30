const axios = require('axios')

const { CLIENT_ID, CLIENT_SECRET } = process.env

/**
 * Temporary token storage.
 * Need a more formal approach ASAP.
 */
let tokenExperationTime
let accessToken

/**
 * Default axios configuration to authenticate with IGDB
 */
const postConfig = {
    headers: {
        Accept: 'application/json',
        'Client-ID': `${CLIENT_ID}`,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'text/plain',
    },
}

/**
 * Validates the current access_token isn't expired.
 * If so, retrieves and stores a new one.
 * @param {String} token access_token
 * @param {Number} expiration time that token expires
 */
const getAccessToken = async (token, expiration) => {
    // check if current token is expired
    // if not, bail out early
    const currentTime = new Date().getTime()
    if (token && currentTime < expiration) return

    // retrieve new token
    const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
    const response = await axios.post(url)
    const { access_token, expires_in } = response.data

    // store it
    accessToken = access_token
    tokenExperationTime = expires_in + currentTime
}

/**
 * Calls IGDB to retrieve data with pre-configured options.
 * @param {String} routeName name of IGDB endpoint you want to hit
 * @returns {Promise<Object>} raw axios response
 */
const Post = async (routeName) => {
    await getAccessToken(accessToken, tokenExperationTime)

    const data = formatData(routeName)
    return axios.post('https://api.igdb.com/v4/games', data, postConfig)
}

/**
 * Formats and returns a text string for querying data to IDGB
 * @param {String} dataType
 * @returns {String} raw text body string
 */
function formatData(dataType) {
    // unix time tables
    // hour 3600
    // day 86400
    // week 604800
    // month 2629743
    // year 31556926
    const currentTime = Math.floor(new Date().getTime() * 0.001)
    const startingTime = currentTime - 604800 //current time - a week in unix

    switch (dataType) {
        case 'new':
            return `fields platforms.*, release_dates.date, release_dates.human, name;
            where release_dates.date >= ${startingTime} & release_dates.date <= ${currentTime};`
        case 'upcoming':
            return `fields platforms.*, release_dates.date, release_dates.human, name;
            where release_dates.date > ${currentTime};`
        case 'popular':
            return `fields platforms.*, release_dates.date, release_dates.human, name, total_rating_count;
            where release_dates.date >= ${startingTime} & release_dates.date <= ${currentTime} & total_rating_count > 20;`
        default:
            return
    }
}

module.exports = { getAccessToken, Post, formatData }
