const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validatePlace } = require('../middleware')
const place = require('../controllers/places') 


router.get('/', catchAsync(place.index))

router.get('/new', isLoggedIn, place.newForm)

router.post('/', isLoggedIn, validatePlace, catchAsync(place.createNew))

router.get('/:id', catchAsync(place.showPlace))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(place.editForm))

router.put('/:id', isLoggedIn, isAuthor, validatePlace, catchAsync(place.updatePlace))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(place.deletePlace)) 

module.exports = router