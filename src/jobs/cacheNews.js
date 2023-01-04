const NewsHelper = require('../utils/newsHelper')

async function cacheNews() {
    console.log('running [News Cache] task...')

    try {
        const news = new NewsHelper()
        const results = await news.fetchRecent()

        console.log(results)
    } catch (error) {
        console.log('error in [News Cache] task...')
        console.error(error)
    }
}

module.exports = { cacheNews }
