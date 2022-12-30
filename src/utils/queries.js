const { oneWeekAgoUnix, nowUnix, oneMonthAgoUnix } = require('./times')

const FIELDS = {
    // Includes base information we plan to use for each and every game across the site.
    game: 'name, slug, total_rating, total_rating_count, cover.image_id',
    // platform by itself is unused currently, but could serve as useful in the future.
    platform:
        'platforms.abbreviation, platforms.slug, platforms.platform_logo.image_id',
    // It makes sense to include platform info on the release_dates to give context
    // to remakes/rereleases.
    release_dates:
        'release_dates.date, release_dates.human, release_dates.platform.abbreviation, release_dates.platform.slug, release_dates.platform.platform_logo.image_id',
}

const WHERE = {
    released_last_7_days: () => {
        return `release_dates.date >= ${oneWeekAgoUnix()} & release_dates.date <= ${nowUnix()}`
    },
    released_last_30_days: () => {
        return `release_dates.date >= ${oneMonthAgoUnix()} & release_dates.date <= ${nowUnix()}`
    },
    unreleased: () => {
        return `release_dates.date > ${nowUnix()}`
    },
    more_than_20_ratings: 'total_rating_count > 20',
    remove_exotic: 'themes != (42)',
}

module.exports = { FIELDS, WHERE }
