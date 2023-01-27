const mongoose = require('mongoose')

const tokensSchema = new mongoose.Schema({
    api: { type: String, unique: true, required: true },
    access_token: { type: String, required: true },
    expiration: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
})
const Tokens = mongoose.model('Tokens', tokensSchema)

// Ensures indexes are in place
// Required to force UNIQUE
// see https://stackoverflow.com/a/52395212
Tokens.createIndexes()

module.exports = Tokens
