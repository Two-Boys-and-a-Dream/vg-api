const { routeHandler } = require('../utils/newsHelper')
const router = require('express').Router()

router.get('/recent', routeHandler)

module.exports = router
