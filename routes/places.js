const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { placeSchema } = require('../schemas')
const ExpressError = require('../utils/ExpressError')
const Places = require('../models/places')

const validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body)
    if(error) {
        const msg = error.details.map( el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res) => {
    const places = await Places.find({})
    res.render('places/index', {places})
}))

router.get('/new', (req, res) => {
    res.render('places/new')
})

router.post('/', validatePlace, catchAsync(async (req, res, next) => {
//    if(!req.body.place) throw new ExpressError('Invalid Place data', 400)
   const place = new Places(req.body.place)
   await place.save()
   res.redirect(`/places/${place._id}`) 
}))

router.get('/:id', catchAsync(async (req, res) => {
    const place = await Places.findById(req.params.id).populate('reviews')
    res.render('places/show', { place })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const place = await Places.findById(req.params.id)
    res.render('places/edit', { place })
} ))

router.put('/:id', validatePlace, catchAsync(async (req, res) => {
    const { id } = req.params
    const place = await Places.findByIdAndUpdate(id, {...req.body.place})
    res.redirect(`/places/${place._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Places.findByIdAndDelete(id)
    res.redirect('/places')
})) 

module.exports = router