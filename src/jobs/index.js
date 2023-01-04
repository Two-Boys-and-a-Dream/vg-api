const cron = require('node-cron')
const { CRONS } = require('../utils/times')
const { cacheNews } = require('./cacheNews')

/**
 * Sets up all jobs
 *
 */
function setupCronJobs() {
    cron.schedule(CRONS.hourly, cacheNews)
}

module.exports = { setupCronJobs }
