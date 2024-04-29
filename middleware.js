const { placeSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Places = require('./models/places')
const Review = require('./models/review')


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in to be able to add places!')
        return res.redirect('/login')
    } next()
}

module.exports.validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body)
    if(error) {
        const msg = error.details.map( el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const place = await Places.findById(id)
    if (!place.author.equals(req.user._id)) {
        req.flash('error', 'You do not have a permission!')
        return res.redirect(`/places/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have a permission!')
        return res.redirect(`/places/${id}`)
    }
    next()
}