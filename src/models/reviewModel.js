import Joi from 'joi'
import { ObjectId } from 'mongodb'

import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { userModel } from './userModel'

const REVIEW_COLLECTION_NAME = 'reviews'
const REVIEW_COLLECTION_SCHEMA = Joi.object({
  review: Joi.string().required().trim().strict(),
  rating: Joi.number().min(1).max(5),

  tour: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  user: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (reqBody) => {
  return await GET_DB()
    .collection(REVIEW_COLLECTION_NAME)
    .insertOne({
      ...reqBody,
      user: new ObjectId(reqBody.user),
      tour: new ObjectId(reqBody.tour)
    })
}

const getAll = async () => {
  try {
    return await GET_DB().collection(REVIEW_COLLECTION_NAME).find().toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const getDetail = async (reviewId) => {
  try {
    return await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(reviewId)
          }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $addFields: {
            user: { $arrayElemAt: ['$user', 0] } // Get the first element of the array
          }
        },
        { $unset: ['user.password'] }
      ])
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const updateDetail = async (tourId, reqBody) => {
  try {
    return await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(tourId) }, { $set: reqBody }, { returnDocument: 'after' })
  } catch (error) {
    throw new Error(error)
  }
}

const deleteDetail = async (reviewId) => {
  try {
    return await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(reviewId) })
  } catch (error) {
    throw new Error(error)
  }
}

export const reviewModel = { REVIEW_COLLECTION_NAME, REVIEW_COLLECTION_SCHEMA, createNew, getDetail, getAll, updateDetail, deleteDetail }
