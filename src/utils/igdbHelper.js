const axios = require('axios')
const { FIELDS, WHERE } = require('./queries')
const { CLIENT_ID, CLIENT_SECRET } = process.env

/**
 * Temporary token storage.
 * Need a more formal approach ASAP.
 */
let accessToken
let tokenExperationTime

class IGDBHelper {
    constructor(endpoint, queryParams) {
        this.accessToken = accessToken
        this.tokenExpiration = tokenExperationTime
        this.endpoint = endpoint
        this.limit = queryParams.limit || '10'
        this.offset = queryParams.offset || '0'
        this.game_id = queryParams.id || '1'
    }

    /**
     * Validates the current access_token isn't expired.
     * If so, retrieves and stores a new one.
     * @param {String} token access_token
     * @param {Number} expiration time that token expires
     */
    async getAccessToken() {
        // check if current token is expired
        // if not, bail out early
        const currentTime = new Date().getTime()
        if (this.accessToken && currentTime < this.tokenExpiration) return

        // retrieve new token
        const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
        const response = await axios.post(url)
        const { access_token, expires_in } = response.data

        // store it
        accessToken = access_token
        this.accessToken = access_token

        const newExpiration = expires_in + currentTime
        tokenExperationTime = newExpiration
        this.tokenExpiration = newExpiration
    }

    /**
     * Default axios configuration to authenticate with IGDB
     * @returns {Object}
     */
    postConfig() {
        return {
            headers: {
                Accept: 'application/json',
                'Client-ID': `${CLIENT_ID}`,
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'text/plain',
            },
        }
    }

    /**
     * Formats and returns a text string for querying data to IDGB
     * @returns {String} raw text body string
     */
    formatBody() {
        let body = ''

        // Build fields & where
        switch (this.endpoint) {
            case 'new':
                body = `fields ${FIELDS.game}, ${FIELDS.release_dates};
                where ${WHERE.released_last_7_days()} & ${WHERE.remove_exotic};`
                break
            case 'upcoming':
                body = `fields ${FIELDS.game}, ${FIELDS.release_dates};
                where ${WHERE.unreleased()} & ${WHERE.remove_exotic};`
                break
            case 'popular':
                body = `fields ${FIELDS.game}, ${FIELDS.release_dates};
                where ${WHERE.released_last_30_days()} & ${
                    WHERE.more_than_20_ratings
                } & ${WHERE.remove_exotic};`
                break
            case 'single':
                body = `fields ${FIELDS.game}, ${FIELDS.game_extended},
                ${FIELDS.release_dates}, ${FIELDS.screenshots},
                ${FIELDS.videos}, ${FIELDS.similar_games},
                ${FIELDS.game_engines}, ${FIELDS.involved_companies};
                where id = ${this.game_id} & ${WHERE.remove_exotic};`
                break
            default:
                break
        }

        // Add limits & offsets
        body += ` limit ${this.limit}; offset ${this.offset};`

        return body
    }

    /**
     * Formats game data results, and adds pagination information
     * to send back as an API response.
     * @param {Array<Object>} data game data
     * @returns
     */
    formatResponse(data) {
        // limit is just the sent in limit
        const limit = Number(this.limit)

        // results count
        const count = data.length

        // last cursor is the sent in offset. This was
        // the starting point of our query
        const lastCursor = Number(this.offset)

        // next cursor should be the ending point of this current query,
        // return undefined if we got fewer results from their API than {this.limit}
        // that means there is no more data to fetch anyways.
        const nextCursor = count === limit ? lastCursor + limit : null

        return {
            count,
            limit,
            lastCursor,
            nextCursor,
            data,
        }
    }

    /**
     * Entrypoint for class. Formats headers/body, then fetches and returns data from IGDB.
     * @returns {Promise<AxiosResponse>}
     */
    async fetchData() {
        await this.getAccessToken()
        const body = this.formatBody()
        const config = this.postConfig()

        const results = await axios.post(
            'https://api.igdb.com/v4/games',
            body,
            config
        )

        return this.formatResponse(results.data)
    }
}

/**
 * Reusable try/catch handler for IGDB routes.
 * @param {Object} req Express request
 * @param {Object} res Express res
 */
async function routeHandler(req, res) {
    const { query, route } = req
    const { path } = route

    try {
        // removes first slash "/" from path
        // ex. "/new" -> "new"
        const sanitizedPath = path.substr(1)
        const IGDB = new IGDBHelper(sanitizedPath, query)
        const data = await IGDB.fetchData()

        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(400)
        res.send(error)
    }
}

module.exports = IGDBHelper
module.exports.routeHandler = routeHandler
