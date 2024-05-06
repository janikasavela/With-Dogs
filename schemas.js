const Joi = require('joi')

module.exports.placeSchema = Joi.object({
    place: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      url: Joi.string().uri().optional().allow(''),
      pnumber: Joi.string().optional().allow(''),
      email: Joi.string().optional().allow('')
    }).required()
})

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
})