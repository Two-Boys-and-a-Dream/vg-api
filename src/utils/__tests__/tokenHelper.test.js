const TokenHelper = require('../tokenHelper')
const axios = require('axios')
const Tokens = require('../../models/Tokens.model')

const apiString = 'IGDB'

const goodToken = { data: { access_token: '5', expires_in: 8600 } }

const storedValidToken = {
    _id: '25',
    expiration: new Date().getTime() + 500000,
    access_token: 'good4u',
    api: apiString,
    created_at: '2022-12-28',
}

const storedExpiredToken = {
    ...storedValidToken,
    expiration: 52,
}

let tokenClient = new TokenHelper(apiString)

beforeEach(() => {
    jest.resetAllMocks()
    axios.post.mockResolvedValue(goodToken)
    tokenClient = new TokenHelper(apiString)
    Tokens.findOne.mockResolvedValue(storedValidToken)
})

afterAll(() => {
    jest.restoreAllMocks()
})

describe('tokenHelper', () => {
    describe('constructor', () => {
        it('sets api to passed in string', () => {
            expect(tokenClient.api).toEqual('IGDB')
        })
    })

    describe('fetchStoredToken', () => {
        it('returns a valid token', async () => {
            const token = await tokenClient.fetchStoredToken()

            expect(token).toEqual('good4u')
        })
        it('returns undefined when no token found', async () => {
            Tokens.findOne.mockResolvedValue(undefined)
            const token = await tokenClient.fetchStoredToken()

            expect(token).toBeUndefined()
        })
        it('returns undefined for expired token', async () => {
            Tokens.findOne.mockResolvedValue(storedExpiredToken)
            const token = await tokenClient.fetchStoredToken()

            expect(token).toBeUndefined()
        })
    })

    describe('storeToken', () => {
        it('stores token properly', async () => {
            const newToken = {
                ...storedValidToken,
                _id: undefined,
            }
            await tokenClient.storeToken(newToken)

            expect(Tokens.findOneAndUpdate).toHaveBeenCalledTimes(1)
        })
    })

    describe('validateToken', () => {
        it('returns true when currentTime is before token expiration', () => {
            const result = tokenClient.validateToken(storedValidToken)

            expect(result).toEqual(true)
        })
        it('returns false when currentTime is after token expiration', () => {
            const result = tokenClient.validateToken(storedExpiredToken)

            expect(result).toEqual(false)
        })
    })

    describe('fetchNewIGDBToken', () => {
        it('returns new access_token', async () => {
            const result = await tokenClient.fetchNewIGDBToken()

            expect(result).toEqual('5')
        })
        it('stores new access_token', async () => {
            await tokenClient.fetchNewIGDBToken()

            expect(Tokens.findOneAndUpdate).toHaveBeenCalledTimes(1)
        })
    })
})
