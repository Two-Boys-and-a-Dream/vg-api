require('dotenv').config()
const express = require('express')
const app = require('express')()
const { gamesRouter, newsRouter } = require('./src/routes')
const cors = require('cors')
const { PORT } = process.env

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get('/', (_req, res) => {
    res.send('Hello World!')
})

app.use('/games', gamesRouter)
app.use('/news', newsRouter)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
