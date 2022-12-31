const { default: axios } = require('axios')
const NewsHelper = require('../newsHelper')

const axiosResponse = { data: [{ id: '1' }, { id: '2' }] }
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
