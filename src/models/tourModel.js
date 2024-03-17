import Joi from 'joi'

const TOUR_COLLECTION_NAME = 'tours'
const TOUR_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(10).max(40).trim().strict(),
  duration: Joi.number().required(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const tourModel = { TOUR_COLLECTION_NAME, TOUR_COLLECTION_SCHEMA }
