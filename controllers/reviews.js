const Review = require('../models/review')
const Places = require('../models/places')

module.exports.addReview = async (req, res) => {
    const place = await Places.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    place.reviews.push(review)
    await review.save()
    await place.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/places/${place._id}`)
}

module.exports.deleteReview = async (req, res,) => {
    const { id, reviewId } = req.params
    await Places.findByIdAndUpdate(id, { pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Succesfully deleted review')
    res.redirect(`/places/${id}`)
}