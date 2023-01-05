const { News } = require('../models/News')
const NewsHelper = require('../utils/newsHelper')

async function cacheNews() {
    console.log('running [News Cache] task...')

    try {
        const news = new NewsHelper()
        const results = await news.fetchRecentFromAPI()

        const promises = results.map(async (item) => {
            const newsItem = new News(item)

            await newsItem.save()
        })

        await Promise.all(promises)
        console.log(new Date().toISOString(), ' [News Cache] new items stored')
    } catch (error) {
        console.log('error in [News Cache] task...')
        console.error(error)
    }
}

module.exports = { cacheNews }
