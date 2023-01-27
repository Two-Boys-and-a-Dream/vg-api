const axios = require('axios')
const Tokens = require('../models/Tokens.model')
const { CLIENT_ID, CLIENT_SECRET } = process.env

/**
 * Helper methods for managing access_tokens
 * @see {@link Tokens}
 */
class TokenHelper {
    constructor(api) {
        this.api = api
    }

    /**
     * Finds and returns the token stored by {api} string
     * @returns {Promise<Object | undefined>} Stored token or undefined
     */
    async fetchStoredToken() {
        // Retrieve stored token
        const stored = await Tokens.findOne({ api: this.api })
        if (!stored) return

        // If stored token, validate it
        const valid = this.validateToken(stored)
        if (!valid) return

        return stored.access_token
    }

    /**
     * Finds and replaces the token stored by {api} string
     * @param {Object} tokenObject Shape of {Token}
     * @returns {Promise<Object>} Old token that was replaced
     */
    async storeToken(tokenObject) {
        const filter = { api: tokenObject.api }
        const options = { new: true, upsert: true }
        return Tokens.findOneAndUpdate(filter, tokenObject, options)
    }

    /**
     * Assesses if a token has expired or not.
     * @param {Object} token
     * @returns {Boolean} true if valid, false if expired
     */
    validateToken(token) {
        const currentTime = new Date().getTime()
        return currentTime < token.expiration
    }

    /**
     * Exchanges credentials for access token to IGDB API. Returns new access_token
     * @returns {Promise<String>} access_token
     */
    async fetchNewIGDBToken() {
        // retrieve new token
        const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
        const response = await axios.post(url)
        const { access_token, expires_in } = response.data

        // store it
        const currentTime = new Date().getTime()
        const newToken = {
            api: 'IGDB',
            access_token,
            expiration: expires_in + currentTime,
            created_at: Date.now(),
        }

        await this.storeToken(newToken)

        return newToken.access_token
    }
}

module.exports = TokenHelper
