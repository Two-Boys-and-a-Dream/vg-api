const { getAccessToken, Post, formatBody } = require('../igdbHelper')
const axios = require('axios')

jest.mock('axios')

const in1Min = new Date().getTime() + 6000

const response = { data: { access_token: '5', expires_in: 8600 } }

beforeEach(() => {
    axios.post.mockResolvedValue(response)
})

describe('igdbHelper', () => {
    describe('getAccessToken', () => {
        it('doesnt fetch new access token, when good access token exists', async () => {
            await getAccessToken('token', in1Min)

            expect(axios.post).not.toHaveBeenCalled()
        })
        it('fetches new token when stored token is undefined', async () => {
            await getAccessToken(undefined, in1Min)

            expect(axios.post).toHaveBeenCalled()
        })
        it('fetches new token when stored token is expired', async () => {
            const pastTime = new Date().getTime() - 6000
            await getAccessToken('string', pastTime)

            expect(axios.post).toHaveBeenCalled()
        })
    })

    describe('Post', () => {
        it('returns axios post object', async () => {
            const res = await Post('string')

            expect(res).toEqual(response)
        })
    })

    describe('formatBody', () => {
        it('handles new case', () => {
            const data = formatBody('new')
            expect(typeof data).toEqual('string')
        })

        it('handles upcoming case', () => {
            const data = formatBody('upcoming')
            expect(typeof data).toEqual('string')
        })

        it('handles popular case', () => {
            const data = formatBody('popular')
            expect(typeof data).toEqual('string')
        })
    })
})
