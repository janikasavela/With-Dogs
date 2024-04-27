const express = require('express')
const router = express.Router({mergeParams: true})

const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const Places = require('../models/places')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas')



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const place = await Places.findById(req.params.id)
    const review = new Review(req.body.review)
    place.reviews.push(review)
    await review.save()
    await place.save()
    res.redirect(`/places/${place._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res,) => {
    const { id, reviewId } = req.params
    await Places.findByIdAndUpdate(id, { pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/places/${id}`)
}))

module.exports = router