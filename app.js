const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Places = require('./models/places')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

mongoose.connect('mongodb://localhost:27017/places')

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true })) //purkaa req bodyn näkyväksi
app.use(methodOverride('_method'))

app.listen(3000, () => {
    console.log("Serving on port 3000")
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/places', async (req, res) => {
    const places = await Places.find({})
    res.render('places/index', {places})
})

app.get('/places/new', (req, res) => {
    res.render('places/new')
})

app.post('/places', async (req, res) => {
   const place = new Places(req.body.place)
   await place.save()
   res.redirect(`/places/${place._id}`)
})

app.get('/places/:id', async (req, res) => {
    const place = await Places.findById(req.params.id)
    res.render('places/show', { place })
})

app.get('/places/:id/edit', async (req, res) => {
    const place = await Places.findById(req.params.id)
    res.render('places/edit', { place })
} )

app.put('/places/:id', async (req, res) => {
    const { id } = req.params
    const place = await Places.findByIdAndUpdate(id, {...req.body.place})
    res.redirect(`/places/${place._id}`)
})

app.delete('/places/:id', async (req, res) => {
    const { id } = req.params
    await Places.findByIdAndDelete(id)
    res.redirect('/places')
}) 


