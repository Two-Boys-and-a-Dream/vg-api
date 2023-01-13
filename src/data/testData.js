const rawNews = [
    {
        title: 'title',
        date: 'some date',
        description: 'some description',
        image: 'testURL',
        link: 'testLink',
    },
    {
        title: 'title2',
        date: 'some other date',
        description: 'a new description',
        image: 'testURL2',
        link: 'testLink2',
    },
]

const DBNews = [
    {
        _id: '507f191e810c19729de860ea',
        ...rawNews[0],
    },
    {
        _id: '3498n39g9qn59vq5vimq09fem',
        ...rawNews[1],
    },
]

module.exports = { rawNews, DBNews }
