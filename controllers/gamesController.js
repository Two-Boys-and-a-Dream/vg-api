const Post = require('../igdbHelper')

module.exports = {
    newGames: async (req, res) => {
        try {
            const { data } = await Post('new')
            res.status(200)
            res.json(data)
        } catch (e) {
            console.log(e)
            res.status(400)
            res.send('happend in new games route')
        }
    },
    upcomingGames: async (req, res) => {
        try {
            const { data } = await Post('upcoming')
            res.status(200)
            res.send(data)
        } catch (e) {
            console.log(e)
            res.status(400)
            res.send('happend in upcoming games route')
        }
    },
    popularGames: async (req, res) => {
        try {
            const { data } = await Post('popular')
            res.status(200)
            res.send(data)
        } catch (e) {
            console.log(e)
            res.status(400)
            res.send('happend in popular games route')
        }
    },
}
