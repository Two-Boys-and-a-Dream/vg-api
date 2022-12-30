// unix time tables
// hour 3600
// day 86400
// week 604800
// month 2629743
// year 31556926

function nowUnix() {
    return Math.floor(new Date().getTime() * 0.001)
}

function oneWeekAgoUnix() {
    return nowUnix() - 604800
}

function oneMonthAgoUnix() {
    return nowUnix() - 2629743
}

module.exports = { nowUnix, oneWeekAgoUnix, oneMonthAgoUnix }
