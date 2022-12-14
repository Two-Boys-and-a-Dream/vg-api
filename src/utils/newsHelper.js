const { default: axios } = require('axios')
const News = require('../models/News.model')
const { NEWS_API_KEY, NEWS_API_HOST, NEWS_API_URL } = process.env

/**
 * Contains methods for returning news articles from
 * News API, or our cached DB articles.
 * @param {String} limit limit number of articles returned from DB call.
 */
class NewsHelper {
    constructor(limit) {
        this.url = NEWS_API_URL
        this.config = {
            headers: {
                'X-RapidAPI-Key': NEWS_API_KEY,
                'X-RapidAPI-Host': NEWS_API_HOST,
            },
        }
        this.limit = Number(limit) || 10
    }

    /**
     * Fetches 10 most recent news articles from news API
     * @returns {Promise<Array<Object>>} news data from API
     */
    async fetchRecentFromAPI() {
        const response = await axios.get(this.url, this.config)

        return response.data
    }

    /**
     * Returns 10 most recent cached articles from our DB.
     * Pass in limit when initiating class to change number returned.
     * @returns {Promise<Array<Object>>} news data from DB
     */
    async fetchCached() {
        const articles = await News.find(null, null, {
            limit: this.limit,
            sort: { date: -1 },
        })

        return articles
    }
}

async function routeHandler(req, res) {
    const { query } = req

    try {
        const news = new NewsHelper(query.limit)

        const results = await news.fetchCached()
        res.status(200)
        res.json(results)
    } catch (error) {
        console.error(error)
        res.status(400)
        res.send(error)
    }
}

module.exports = NewsHelper
module.exports.routeHandler = routeHandler
