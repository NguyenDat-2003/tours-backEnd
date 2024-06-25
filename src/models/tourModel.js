import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { userModel } from './userModel'
import { reviewModel } from './reviewModel'

const TOUR_COLLECTION_NAME = 'tours'
const TOUR_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  duration: Joi.number().required(),
  maxGroupSize: Joi.number().required(),
  difficulty: Joi.string().required().valid('easy', 'medium', 'difficult'),
  ratingsAverage: Joi.number().min(1).max(5).default(4.5),
  ratingsQuantity: Joi.number().default(0),
  price: Joi.number().required(),
  priceDiscount: Joi.number().less(Joi.ref('price')),
  summary: Joi.string().required().trim().strict(),
  imageCover: Joi.string().required().trim().strict(),
  description: Joi.string().trim().strict(),
  images: Joi.array().items(Joi.string()).default([]),
  startDates: Joi.array().items(Joi.string()).default([]),
  secretTour: Joi.boolean().default(false),
  startLocation: Joi.object({
    description: Joi.string(),
    type: Joi.valid('Point'),
    coordinates: Joi.array().items(Joi.number()),
    address: Joi.string()
  }),
  locations: Joi.array().items(
    Joi.object({
      // _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      description: Joi.string(),
      type: Joi.valid('Point'),
      coordinates: Joi.array().items(Joi.number()),
      day: Joi.number()
    })
  ),
  guides: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

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
    // console.log(validData.locations)

    if (validData.guides) {
      validData.guides = validData.guides.map((guide) => new ObjectId(guide))
    }

    return await GET_DB().collection(TOUR_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async () => {
  try {
    return await GET_DB()
      .collection(TOUR_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _destroy: false
          }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'guides',
            foreignField: '_id',
            as: 'guides'
          }
        },
        { $unset: ['guides.password'] }
      ])
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const getDetail = async (tourId) => {
  try {
    return await GET_DB()
      .collection(TOUR_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(tourId),
            _destroy: false
          }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'guides',
            foreignField: '_id',
            as: 'guides'
          }
        },
        {
          $lookup: {
            from: reviewModel.REVIEW_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'tour',
            pipeline: [
              {
                $lookup: {
                  from: userModel.USER_COLLECTION_NAME,
                  localField: 'user',
                  foreignField: '_id',
                  as: 'reviews_user'
                }
              },
              { $unset: ['reviews_user.password'] }
            ],
            as: 'reviews_tours'
          }
        },
        { $unset: ['guides.password'] }
      ])
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const deleteDetail = async (tourId) => {
  try {
    return await GET_DB()
      .collection(TOUR_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(tourId) })
  } catch (error) {
    throw new Error(error)
  }
}

const updateDetail = async (tourId, reqBody) => {
  try {
    return await GET_DB()
      .collection(TOUR_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(tourId) }, { $set: reqBody }, { returnDocument: 'after' })
  } catch (error) {
    throw new Error(error)
  }
}

const calcAverageRatings = async (stats, tourId) => {
  try {
    if (stats.length > 0) {
      return await GET_DB()
        .collection(TOUR_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: stats[0]._id },
          {
            $set: {
              ratingsQuantity: stats[0].nRating,
              ratingsAverage: stats[0].avgRating
            }
          }
        )
    } else {
      return await GET_DB()
        .collection(TOUR_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: tourId },
          {
            $set: { ratingsQuantity: 0, ratingsAverage: 3 }
          }
        )
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const tourModel = { TOUR_COLLECTION_NAME, TOUR_COLLECTION_SCHEMA, createNew, getDetail, getAll, deleteDetail, updateDetail, calcAverageRatings }
