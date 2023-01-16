const { UNIX } = require('./times')

const FIELDS = {
    // Includes base information we plan to use for each and every game across the site.
    game: 'name, slug, total_rating, total_rating_count, cover.image_id, summary, first_release_date',
    // Full game information for a single game.
    game_extended: 'follows, genres.name, genres.slug, storyline, websites.url',
    // Same information as "game", but nested.
    similar_games:
        'similar_games.name, similar_games.slug, similar_games.total_rating, similar_games.total_rating_count, similar_games.cover.image_id',
    // platform by itself is unused currently, but could serve as useful in the future.
    platform:
        'platforms.abbreviation, platforms.slug, platforms.platform_logo.image_id',
    // It makes sense to include platform info on the release_dates to give context
    // to remakes/rereleases.
    release_dates:
        'release_dates.date, release_dates.human, release_dates.platform.abbreviation, release_dates.platform.slug, release_dates.platform.platform_logo.image_id',
    screenshots: 'screenshots.image_id, screenshots.height, screenshots.width',
    videos: 'videos.name, videos.video_id',
    game_engines: 'game_engines.name, game_engines.slug, game_engines.url',
    involved_companies:
        'involved_companies.company.name, involved_companies.company.slug, involved_companies.company.websites.url, involved_companies.developer, involved_companies.publisher, involved_companies.porting, involved_companies.supporting',
}

const WHERE = {
    released_last_7_days: () => {
        const unix = new UNIX()
        return `release_dates.date >= ${unix.oneWeekAgo()} & release_dates.date <= ${unix.now()}`
    },
    unreleased: () => {
        const unix = new UNIX()
        return `release_dates.date > ${unix.now()}`
    },
    more_than_x_ratings: (x) => `total_rating_count > ${x}`,
    rated_x_or_higher: (x) => `total_rating >= ${x}`,
    remove_exotic: 'themes != (42)',
}

const SORT = {
    first_release_date_oldest_first: 'first_release_date asc',
    first_release_date_newest_first: 'first_release_date desc',
    release_date_oldest_first: 'release_dates.date desc',
    release_date_newest_first: 'release_dates.date asc',
}

module.exports = { FIELDS, WHERE, SORT }
