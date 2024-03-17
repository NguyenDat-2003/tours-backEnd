import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const TOUR_COLLECTION_NAME = 'tours'
const TOUR_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  duration: Joi.number().required(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await TOUR_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    //--- Kiểm tra data trước khi insert vào database
    const validData = await validateBeforeCreate(data)

    return await GET_DB().collection(TOUR_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (tourId) => {
  try {
    return await GET_DB()
      .collection(TOUR_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(tourId) })
  } catch (error) {
    throw new Error(error)
  }
}

export const tourModel = { TOUR_COLLECTION_NAME, TOUR_COLLECTION_SCHEMA, createNew, findOneById }
