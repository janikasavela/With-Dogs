const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validatePlace } = require('../middleware')
const place = require('../controllers/places') 

router.route('/')
     .get(catchAsync(place.index))
     .post(isLoggedIn, validatePlace, catchAsync(place.createNew))

router.get('/new', isLoggedIn, place.newForm)

router.route('/:id')
     .get(catchAsync(place.showPlace))
     .put(isLoggedIn, isAuthor, validatePlace, catchAsync(place.updatePlace))
     .delete(isLoggedIn, isAuthor, catchAsync(place.deletePlace)) 

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(place.editForm))

module.exports = router