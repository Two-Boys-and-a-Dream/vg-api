jest.mock('axios')
jest.mock('mongoose', () => {
    const mocked = jest.createMockFromModule('mongoose')
    return {
        ...mocked,
        model: jest.fn().mockImplementation(() => ({
            createIndexes: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
        })),
    }
})

process.env.CLIENT_ID = 'testClientId'
process.env.CLIENT_SECRET = 'testClientSecret'
process.env.PORT = 'test'
process.env.NEWS_API_KEY = 'newsAPIKey123'
process.env.NEWS_API_KEY = 'newsHostTest'
process.env.NEWS_API_KEY = 'newsURLTest'
