const { default: axios } = require('axios')
const { DBNews } = require('../../data/testData')
const News = require('../../models/News.model')
const NewsHelper = require('../newsHelper')
const { routeHandler } = require('../newsHelper')

jest.mock('../../models/News.model')

const axiosResponse = { data: [{ id: '1' }, { id: '2' }] }
const req = {
    query: {
        limit: 5,
    },
}
const res = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
}

beforeEach(() => {
    jest.resetAllMocks()
    axios.get.mockResolvedValue(axiosResponse)
    News.find.mockResolvedValue(DBNews)
})

describe('newsHelper class', () => {
    describe('fetchRecent', () => {
        it('returns axios data', async () => {
            const news = new NewsHelper()

            const results = await news.fetchRecentFromAPI()

            expect(results).toEqual(axiosResponse.data)
        })
    })
})

describe('routeHandler', () => {
    it('handles success', async () => {
        await routeHandler(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(DBNews)
    })
    it('handles error', async () => {
        News.find.mockRejectedValue({})
        await routeHandler(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({})
    })
})
