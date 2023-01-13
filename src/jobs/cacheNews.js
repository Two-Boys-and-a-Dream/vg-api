const News = require('../models/News.model')
const NewsHelper = require('../utils/newsHelper')

/**
 * Fetches latest news articles,
 * stores non-duplicates in DB.
 */
async function cacheNews() {
    console.log('[News Cache] running task...')

    try {
        // Fetch the most recent 10 articles
        const news = new NewsHelper()
        const articles = await news.fetchRecentFromAPI()

        // Create promises to save each article to DB
        const promises = articles.map((article) => News.create(article))

        // Wait out the promises
        const results = await Promise.allSettled(promises)

        // Log results
        const newItems = results.filter((item) => item.status === 'fulfilled')
        console.log(
            `[News Cache] ${new Date().toISOString()} ${
                newItems.length
            } new items stored`
        )
    } catch (error) {
        console.log('[News Cache] error in task...')
        console.error(error)
    }
}

module.exports = { cacheNews }
