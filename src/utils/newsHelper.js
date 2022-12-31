const { default: axios } = require('axios')
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

    async fetchRecent() {
        const response = await axios.get(this.url, this.config)

        return response.data
    }
}

async function routeHandler(_req, res) {
    try {
        const News = new NewsHelper()

        const results = await News.fetchRecent()
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
