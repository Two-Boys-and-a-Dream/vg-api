const { oneWeekAgoUnix, nowUnix, oneMonthAgoUnix } = require('./times')

const FIELDS = {
    // Includes base information we plan to use for each and every game across the site.
    game: 'name, slug, total_rating, total_rating_count, cover.image_id',
    // Full game information for a single game.
    game_extended: 'follows, genres.name, genres.slug, summary, websites.url',
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
