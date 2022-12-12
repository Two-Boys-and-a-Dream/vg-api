const express = require("express");
const app = require('express')();
const PORT = 3001


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`))