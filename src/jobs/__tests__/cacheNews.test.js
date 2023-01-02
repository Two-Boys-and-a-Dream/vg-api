const { cacheNews } = require('../cacheNews')
const axios = require('axios')

const errorSpy = jest.spyOn(console, 'error')

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

        expect(errorSpy).not.toHaveBeenCalled()
    })
    it('handles errpr', async () => {
        axios.get.mockRejectedValue({})
        await cacheNews()

        expect(errorSpy).toHaveBeenCalledTimes(1)
    })
})
