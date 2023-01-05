const News = require('../models/News.model')
const NewsHelper = require('../utils/newsHelper')

async function cacheNews() {
    console.log('running [News Cache] task...')

    try {
        const news = new NewsHelper()
        const results = await news.fetchRecentFromAPI()

        await News.create(results)
        console.log(new Date().toISOString(), ' [News Cache] new items stored')
    } catch (error) {
        console.log('error in [News Cache] task...')
        console.error(error)
    }
}

module.exports = { cacheNews }
