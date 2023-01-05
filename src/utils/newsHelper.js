const { default: axios } = require('axios')
const { News } = require('../models/News')
const { NEWS_API_KEY, NEWS_API_HOST, NEWS_API_URL } = process.env

class NewsHelper {
    constructor() {
        this.url = NEWS_API_URL
        this.config = {
            headers: {
                'X-RapidAPI-Key': NEWS_API_KEY,
                'X-RapidAPI-Host': NEWS_API_HOST,
            },
        }
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
     * Returns 10 most recent cached articles from our DB
     * @returns {Promise<Array<Object>>} news data from DB
     */
    async fetchCached() {
        const articles = await News.find()

        return articles
    }
}

async function routeHandler(_req, res) {
    try {
        const news = new NewsHelper()

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
