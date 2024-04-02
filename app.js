const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Places = require('./models/places')

mongoose.connect('mongodb://localhost:27017/places')

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.listen(3000, () => {
    console.log("Serving on port 3000")
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makeplace', async (req, res) => {
    const place = new Places({ title: 'My Backyard'})
    await place.save()
    res.send(place)
})