const { cacheNews } = require('../cacheNews')
const axios = require('axios')

const News = require('../../models/News.model')

jest.mock('../../models/News.model')

beforeEach(() => {
    jest.resetAllMocks()
    axios.get.mockResolvedValue({ data: [] })
})

afterAll(() => {
    jest.restoreAllMocks()
})

describe('cacheNews', () => {
    it('handles success', async () => {
        await cacheNews()

        expect(News.create).toHaveBeenCalledTimes(1)
    })
    it('handles error', async () => {
        axios.get.mockRejectedValue({})
        await cacheNews()

        expect(News.create).not.toHaveBeenCalled()
    })
})
