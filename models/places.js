const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')

const opts = { toJSON: { virtuals: true } }

const PlacesSchema = new Schema({
    title: String,
    image: 
        {
            url: String,
            filename: String 
        },
    geometry: {
        type: {
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
            type: String,
            enum: ['Store', 'Grocery', 'Hiking', 'Hotel', 'Swimming place', 'Skiing', 'Restaraunt', 'Cafe', 'Other services'],
            required: true
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [ {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
    ]
}, opts)

PlacesSchema.virtual('properties.popUp').get(function () {
    return `<strong><a href="/places/${this._id}">${this.title}</a><strong><p>${this.description.substring(0,50)}...</p>`
})

PlacesSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Places', PlacesSchema)