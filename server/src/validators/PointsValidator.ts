import { celebrate, Joi } from 'celebrate'

const PointsValidator = {
  create: celebrate({
      body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().max(2).required(),
      items: Joi.string().required()
    })
  }, {
    abortEarly: false
  })
}

export default PointsValidator
