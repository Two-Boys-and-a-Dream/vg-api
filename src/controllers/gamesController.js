const { Post } = require('../utils/igdbHelper')

module.exports = {
    newGames: async (req, res) => {
        try {
            const { data } = await Post('new')
            res.status(200)
            res.json(data)
        } catch (e) {
            console.log(e)
            res.status(400)
            res.send(e)
        }
    },
    upcomingGames: async (req, res) => {
        try {
            const { data } = await Post('upcoming')
            res.status(200)
            res.json(data)
        } catch (e) {
            console.log(e)
            res.status(400)
            res.send(e)
        }
    },
    popularGames: async (req, res) => {
        try {
            const { data } = await Post('popular')
            res.status(200)
            res.json(data)
        } catch (e) {
            console.log(e)
            res.status(400)
            res.send(e)
        }
    },
}
