const Places = require('../models/places')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {
    const places = await Places.find({})
    res.render('places/index', {places})
}

module.exports.newForm = (req, res) => {
    res.render('places/new')
}

module.exports.createNew = async (req, res, next) => {
       const geoData = await geocoder.forwardGeocode({
        query: req.body.place.location,
        limit: 1
       }).send()
       const place = new Places(req.body.place)
       place.geometry = geoData.body.features[0].geometry
       if(req.file) place.image = { url: req.file.path, filename: req.file.filename } 
       else { place.image.url = "https://images.unsplash.com/photo-1521354465180-c1ceac1d709a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
       place.author = req.user._id
       await place.save()
       console.log(place)
       req.flash('success', 'Succesfully added a new place!')
       res.redirect(`/places/${place._id}`)  
    }

module.exports.showPlace = async (req, res) => {
    const place = await Places.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if(!place) {
        req.flash('error', 'Cannot find that place!')
        return res.redirect('/places')
    }
    res.render('places/show', { place })
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params
    const place = await Places.findById(id)
    if(!place) {
        req.flash('error', 'Cannot find that place!')
        return res.redirect('/places')
    }
    res.render('places/edit', { place })
}

module.exports.updatePlace = async (req, res) => {
    const { id } = req.params
    const place = await Places.findByIdAndUpdate(id, {...req.body.place})
    place.image = { url: req.file.path, filename: req.file.filename }
    await place.save()
    req.flash('success', 'Successfully updated!')
    res.redirect(`/places/${place._id}`)
}

module.exports.deletePlace = async (req, res) => {
    const { id } = req.params
    await Places.findByIdAndDelete(id)
    req.flash('success', 'Succesfully deleted place')
    res.redirect('/places')
}