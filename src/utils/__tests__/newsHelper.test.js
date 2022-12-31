const { default: axios } = require('axios')
const NewsHelper = require('../newsHelper')
const { routeHandler } = require('../newsHelper')

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
})

describe('newsHelper class', () => {
    describe('fetchRecent', () => {
        it('returns axios data', async () => {
            const News = new NewsHelper()

            const results = await News.fetchRecent()

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
        axios.get.mockRejectedValue({})
        await routeHandler(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({})
    })
})
