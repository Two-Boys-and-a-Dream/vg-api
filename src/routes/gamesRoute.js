const router = require('express').Router()
const { routeHandler } = require('../utils/igdbHelper')

router.get('/new', routeHandler)
router.get('/upcoming', routeHandler)
router.get('/popular', routeHandler)
router.get('/single', routeHandler)

module.exports = router
