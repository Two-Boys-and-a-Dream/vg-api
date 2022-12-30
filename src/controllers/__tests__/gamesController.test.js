const { Post } = require('../../utils/igdbHelper')
const { newGames, upcomingGames, popularGames } = require('../gamesController')

jest.mock('../../utils/igdbHelper')

const response = { data: { something: 1 } }

const res = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
}

beforeEach(() => {
    Post.mockResolvedValue(response)
})

describe('gamesController', () => {
    describe('newGames', () => {
        it('handles success', async () => {
            await newGames({}, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ something: 1 })
        })

        it('handles error', async () => {
            Post.mockRejectedValue({})
            await newGames({}, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({})
        })
    })

    describe('upcomingGames', () => {
        it('handles success', async () => {
            await upcomingGames({}, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ something: 1 })
        })

        it('handles error', async () => {
            Post.mockRejectedValue({})
            await upcomingGames({}, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({})
        })
    })

    describe('popularGames', () => {
        it('handles success', async () => {
            await popularGames({}, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ something: 1 })
        })

        it('handles error', async () => {
            Post.mockRejectedValue({})
            await popularGames({}, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({})
        })
    })
})
