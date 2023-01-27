const axios = require('axios')
const { FIELDS, WHERE, SORT } = require('./queries')
const TokenHelper = require('./tokenHelper')
const { CLIENT_ID } = process.env

/**
 * Entry point for interacting with the IGDB API.
 */
class IGDBHelper {
    constructor(endpoint, queryParams) {
        this.accessToken = undefined
        this.endpoint = endpoint
        this.limit = queryParams.limit || '10'
        this.offset = queryParams.offset || '0'
        this.game_id = queryParams.id || '1'
    }

    /**
     * Retrieves & locally stores accessToken for IGDB API.
     */
    async setupAccessToken() {
        const tokenClient = new TokenHelper('IGDB')
        let token = await tokenClient.fetchStoredToken()

        // If no valid token, fetch a new one.
        if (!token) {
            token = await tokenClient.fetchNewIGDBToken()
        }

        this.accessToken = token
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
                body = `
                fields ${FIELDS.game}, ${FIELDS.release_dates};
                sort ${SORT.first_release_date_newest_first};
                where ${WHERE.released_last_7_days()} & ${WHERE.remove_exotic};`

                break
            case 'upcoming':
                body = `
                fields ${FIELDS.game}, ${FIELDS.release_dates};
                sort ${SORT.first_release_date_oldest_first};
                where ${WHERE.unreleased()} & ${WHERE.remove_exotic};`

                break
            case 'popular':
                body = `
                fields ${FIELDS.game}, ${FIELDS.release_dates};
                sort ${SORT.first_release_date_newest_first};
                where ${WHERE.more_than_x_ratings(
                    50
                )} & ${WHERE.rated_x_or_higher(70)} & ${WHERE.remove_exotic};`

                break
            case 'single':
                body = `
                fields ${FIELDS.game}, ${FIELDS.game_extended},
                ${FIELDS.release_dates}, ${FIELDS.screenshots},
                ${FIELDS.videos}, ${FIELDS.similar_games},
                ${FIELDS.game_engines}, ${FIELDS.involved_companies};
                sort ${SORT.release_date_oldest_first};
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
     * @returns {Object} response including data & pagination info
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
     * Entrypoint for class. Formats headers/body,
     * then fetches and returns data from IGDB.
     * @returns {Promise<Object>}
     */
    async fetchData() {
        await this.setupAccessToken()
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
