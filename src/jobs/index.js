const cron = require('node-cron')
const { CRONS } = require('../utils/times')
const { cacheNews } = require('./cacheNews')
const { APP_ENV } = process.env

/**
 * Sets up all jobs
 *
 */
function setupCronJobs() {
    // Production only Cron jobs
    if (APP_ENV === 'prod') {
        cron.schedule(CRONS.hourly, cacheNews)
    }
    // Add crons that are safe to run for dev & prod below
}

module.exports = { setupCronJobs }
