const express = require('express');
const app = require('express')();
const cors = require('cors')
const gamesRouter = require('./routes/gamesRoute');
const PORT = 3001



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/games', gamesRouter);

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`))