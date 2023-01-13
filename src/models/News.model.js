const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true },
    date: String,
    description: String,
    image: String,
    link: String,
})

const News = mongoose.model('News', newsSchema)

// Ensures indexes are in place
// Required to force UNIQUE
// see https://stackoverflow.com/a/52395212
News.createIndexes()

module.exports = News
