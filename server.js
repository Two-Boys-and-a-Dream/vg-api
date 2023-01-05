require('dotenv').config()
const express = require('express')
const app = require('express')()
const cors = require('cors')
const mongoose = require('mongoose')
const { gamesRouter, newsRouter } = require('./src/routes')
const { setupCronJobs } = require('./src/jobs')
const { PORT, MONGO_URL } = process.env

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get('/', (_req, res) => {
    res.send('Hello World!')
})

app.use('/games', gamesRouter)
app.use('/news', newsRouter)

app.listen(PORT, main)

/**
 * Connects to DB, schedules cron jobs.
 */
async function main() {
    try {
        // https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
        mongoose.set('strictQuery', true)
        await mongoose.connect(MONGO_URL)
        setupCronJobs()
        console.log('Successfully connected to DB')
        console.log(`Listening on port ${PORT}`)
    } catch (error) {
        console.error('error connecting to DB ', error)
    }
}
