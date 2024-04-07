const mongoose = require('mongoose')
const Places = require('../models/places')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/places')

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Places.deleteMany({})
    for (let i=0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const place = new Places({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: 'https://plus.unsplash.com/premium_photo-1661505140462-250cbd3a47cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Tähän joku kuvaus',
        price
    })
        await place.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})