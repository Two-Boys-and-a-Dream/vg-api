const { default: axios } = require('axios')
const { News } = require('../../models/News')
const NewsHelper = require('../newsHelper')
const { routeHandler } = require('../newsHelper')

jest.mock('../../models/News')

const axiosResponse = { data: [{ id: '1' }, { id: '2' }] }
const req = {}
const res = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
}

beforeEach(() => {
    jest.resetAllMocks()
    axios.get.mockResolvedValue(axiosResponse)
    News.find.mockResolvedValue(axiosResponse.data)
})

describe('newsHelper class', () => {
    describe('fetchRecent', () => {
        it('returns axios data', async () => {
            const News = new NewsHelper()

            const results = await News.fetchRecentFromAPI()

            expect(results).toEqual(axiosResponse.data)
        })
    })
})

describe('routeHandler', () => {
    it('handles success', async () => {
        await routeHandler(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(axiosResponse.data)
    })
    it('handles error', async () => {
        News.find.mockRejectedValue({})

        await routeHandler(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({})
    })
})
