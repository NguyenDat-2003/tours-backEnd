import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const REVIEW_COLLECTION_NAME = 'reviews'
const REVIEW_COLLECTION_SCHEMA = Joi.object({
  tourId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  review: Joi.string().required().trim().strict(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const reviewModel = { REVIEW_COLLECTION_NAME, REVIEW_COLLECTION_SCHEMA }
