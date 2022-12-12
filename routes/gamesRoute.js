const router = require('express').Router();
const controller = require('../controllers/gamesController')

router.get('/new', controller.newGames);
router.get('/upcoming', controller.upcomingGames);
router.get('/popular', controller.popularGames);

module.exports = router;