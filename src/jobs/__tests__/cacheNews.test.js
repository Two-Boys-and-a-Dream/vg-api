const { cacheNews } = require('../cacheNews')
const axios = require('axios')
const News = require('../../models/News.model')
const { rawNews } = require('../../data/testData')

jest.mock('../../models/News.model')

beforeEach(() => {
    jest.resetAllMocks()
    axios.get.mockResolvedValue({ data: rawNews })
})

afterAll(() => {
    jest.restoreAllMocks()
})

describe('cacheNews', () => {
    it('handles success', async () => {
        await cacheNews()

        expect(News.create).toHaveBeenCalledTimes(2)
    })
    it('handles error', async () => {
        axios.get.mockRejectedValue({})
        await cacheNews()

        expect(News.create).not.toHaveBeenCalled()
    })
})
