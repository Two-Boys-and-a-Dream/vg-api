/**
 * Provides helper functions related to calculating UNIX timestamps
 */
class UNIX {
    constructor() {
        this._now = Math.floor(new Date().getTime() * 0.001)
    }

    timeTable = {
        hour: 3600,
        day: 86400,
        week: 604800,
        month: 2629743,
        year: 31556926,
    }

    /**
     * Generates UNIX timestamp for now
     * @returns {Number} UNIX timestamp
     */
    now() {
        return this._now
    }

    /**
     * Generates UNIX timestamp for 7 days prior to now
     * @returns {Number} UNIX timestamp
     */
    oneWeekAgo() {
        return this._now - this.timeTable.week
    }
}

const CRONS = {
    // "At minute 0 past every hour."
    // https://crontab.guru/#0_*/1_*_*_*
    hourly: '0 */1 * * *',
}

module.exports = { UNIX, CRONS }
