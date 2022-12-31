const IGDBHelper = require('../igdbHelper')
const axios = require('axios')

jest.mock('axios')

const in1Min = new Date().getTime() + 6000
const response = { data: { access_token: '5', expires_in: 8600 } }
const req = { route: { path: '/somewhere' } }
const res = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
}

beforeEach(() => {
    axios.post.mockResolvedValue(response)
})

describe('igdbHelper', () => {
    describe('getAccessToken', () => {
        it('doesnt fetch new access token, when good access token exists', async () => {
            await IGDBHelper.getAccessToken('token', in1Min)

            expect(axios.post).not.toHaveBeenCalled()
        })
        it('fetches new token when stored token is undefined', async () => {
            await IGDBHelper.getAccessToken(undefined, in1Min)

            expect(axios.post).toHaveBeenCalled()
        })
        it('fetches new token when stored token is expired', async () => {
            const pastTime = new Date().getTime() - 6000
            await IGDBHelper.getAccessToken('string', pastTime)

            expect(axios.post).toHaveBeenCalled()
        })
    })

    describe('routeHandler', () => {
        it('handles success', async () => {
            await IGDBHelper.routeHandler(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(response.data)
        })
        it('handles error', async () => {
            axios.post.mockRejectedValue({})
            await IGDBHelper.routeHandler(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({})
        })
    })

    describe('Post', () => {
        it('returns axios post object', async () => {
            const res = await IGDBHelper.Post('string')

            expect(res).toEqual(response)
        })
    })

    describe('formatBody', () => {
        it('handles new case', () => {
            const data = IGDBHelper.formatBody('new')
            expect(typeof data).toEqual('string')
        })

        it('handles upcoming case', () => {
            const data = IGDBHelper.formatBody('upcoming')
            expect(typeof data).toEqual('string')
        })

        it('handles popular case', () => {
            const data = IGDBHelper.formatBody('popular')
            expect(typeof data).toEqual('string')
        })
    })
})
