const Places = require('../models/places')

module.exports.index = async (req, res) => {
    const places = await Places.find({})
    res.render('places/index', {places})
}

module.exports.newForm = (req, res) => {
    res.render('places/new')
}

module.exports.createNew = async (req, res, next) => {
       const place = new Places(req.body.place)
       place.image = { url: req.file.path, filename: req.file.filename }
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