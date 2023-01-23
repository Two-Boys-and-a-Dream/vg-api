const IGDBHelper = require('../igdbHelper')
const { routeHandler } = require('../igdbHelper')
const axios = require('axios')

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
        const expected = {
            count: 1,
            data: response.data,
            limit: 15,
            lastCursor: 10,
            nextCursor: null,
        }

        await routeHandler(req, res)

        expect(res.json).toHaveBeenCalledWith(expected)
    })

    it('adds nextCursor information when data.length matches limit', async () => {
        const thisReq = {
            route: { path: '/somewhere' },
            query: { limit: '1', offset: '50' },
        }
        const expected = {
            count: 1,
            data: response.data,
            limit: 1,
            lastCursor: 50,
            nextCursor: 51,
        }

        await routeHandler(thisReq, res)

        expect(res.json).toHaveBeenCalledWith(expected)
    })

    it('handles error', async () => {
        axios.post.mockRejectedValue({})
        await routeHandler(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({})
    })
})
