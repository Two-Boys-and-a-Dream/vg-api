const axios = require('axios')
const { FIELDS, WHERE } = require('./queries')
const { CLIENT_ID, CLIENT_SECRET } = process.env

/**
 * Temporary token storage.
 * Need a more formal approach ASAP.
 */
let tokenExperationTime
let accessToken

/**
 * Default axios configuration to authenticate with IGDB
 * @returns {Object}
 */
function postConfig() {
    return {
        headers: {
            Accept: 'application/json',
            'Client-ID': `${CLIENT_ID}`,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'text/plain',
        },
    }
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
 * Reusable try/catch handler for IGDB routes.
 * @param {Object} req Express request
 * @param {Object} res Express res
 */
async function routeHandler(req, res) {
    const { path } = req.route
    try {
        // removes first slash "/" from path
        // ex. "/new" -> "new"
        const sanitizedPath = path.substr(1)
        const { data } = await Post(sanitizedPath)

        res.status(200)
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(400)
        res.send(error)
    }
}

/**
 * Calls IGDB to retrieve data with pre-configured options.
 * @param {String} routeName name of IGDB endpoint you want to hit
 * @returns {Promise<Object>} raw axios response
 */
async function Post(routeName) {
    await getAccessToken(accessToken, tokenExperationTime)
    // status 401 (NUMBER)
    const body = formatBody(routeName)
    return axios.post('https://api.igdb.com/v4/games', body, postConfig())
}

/**
 * Formats and returns a text string for querying data to IDGB
 * @param {String} dataType
 * @returns {String} raw text body string
 */
function formatBody(dataType) {
    switch (dataType) {
        case 'new':
            return `fields ${FIELDS.game}, ${FIELDS.release_dates};
                where ${WHERE.released_last_7_days()} & ${WHERE.remove_exotic};`
        case 'upcoming':
            return `fields ${FIELDS.game}, ${FIELDS.release_dates};
                where ${WHERE.unreleased()} & ${WHERE.remove_exotic};`
        case 'popular':
            return `fields ${FIELDS.game}, ${FIELDS.release_dates};
                where ${WHERE.released_last_30_days()} & ${
                WHERE.more_than_20_ratings
            } & ${WHERE.remove_exotic};`
        default:
            return
    }
}

module.exports = { getAccessToken, routeHandler, Post, formatBody }
