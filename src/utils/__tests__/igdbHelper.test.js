const IGDBHelper = require('../igdbHelper')
const { routeHandler } = require('../igdbHelper')
const axios = require('axios')

const goodToken = { data: { access_token: '5', expires_in: 8600 } }
const badToken = { data: { access_token: '5', expires_in: -500 } }
const response = { data: [{ id: '1' }] }

const queryParams = { limit: '15', offset: '10' }
const req = { route: { path: '/somewhere' }, query: queryParams }
const res = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
}

const endpoint = 'new'

let IGDB = new IGDBHelper(endpoint, queryParams)

beforeEach(() => {
    jest.resetAllMocks()
    axios.post.mockResolvedValue(response)
    IGDB = new IGDBHelper(endpoint, queryParams)
})

describe('igdbHelper', () => {
    describe('constructor', () => {
        it('sets limit/offset to passed in values', () => {
            expect(IGDB.limit).toEqual(queryParams.limit)
            expect(IGDB.offset).toEqual(queryParams.offset)
        })
        it('sets limit/offset to defaults when not provided', () => {
            IGDB = new IGDBHelper(endpoint, {})

            expect(IGDB.limit).toEqual('10')
            expect(IGDB.offset).toEqual('0')
        })
    })
    describe('getAccessToken', () => {
        it('fetches new token when stored token is undefined', async () => {
            axios.post.mockResolvedValue(badToken)
            await IGDB.getAccessToken()

            expect(axios.post).toHaveBeenCalledTimes(1)
        })
        it('fetches new token when stored token is expired', async () => {
            axios.post.mockResolvedValue(goodToken)
            await IGDB.getAccessToken()

            expect(axios.post).toHaveBeenCalledTimes(1)

            // next call should not re-fetch, since the token just received
            // is good now
            await IGDB.getAccessToken()
            expect(axios.post).toHaveBeenCalledTimes(1)
        })

        it('doesnt fetch new access token, when good access token exists', async () => {
            await IGDB.getAccessToken()

            // next call should re-use, no call to axios post
            await IGDB.getAccessToken()
            expect(axios.post).not.toHaveBeenCalled()
        })
    })

    describe('formatBody', () => {
        it('handles new case', () => {
            const data = IGDB.formatBody()
            expect(typeof data).toEqual('string')
        })

        it('handles upcoming case', () => {
            IGDB = new IGDBHelper('upcoming', queryParams)

            const data = IGDB.formatBody()
            expect(typeof data).toEqual('string')
        })

        it('handles popular case', () => {
            IGDB = new IGDBHelper('popular', queryParams)

            const data = IGDB.formatBody()
            expect(typeof data).toEqual('string')
        })
        it('handles single case', () => {
            IGDB = new IGDBHelper('single', { ...queryParams, id: '12' })

            const data = IGDB.formatBody()
            expect(typeof data).toEqual('string')
        })
    })
})

describe('routeHandler', () => {
    it('handles success', async () => {
        await routeHandler(req, res)

        expect(res.json).toHaveBeenCalledWith(response.data)
    })
    it('handles error', async () => {
        axios.post.mockRejectedValue({})
        await routeHandler(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({})
    })
})
