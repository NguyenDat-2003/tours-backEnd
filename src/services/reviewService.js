/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'

import { reviewModel } from '~/models/reviewModel'
import ApiError from '~/utils/ApiError'

const createNew = async (req) => {
  try {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user._id

    const createdReview = await reviewModel.createNew(req.body)
    const getNewReview = await reviewModel.getDetail(createdReview.insertedId)
    return getNewReview
  } catch (error) {
    throw error
  }
}

const getAll = async (tourId) => {
  try {
    return await reviewModel.getAll(tourId)
  } catch (error) {
    throw error
  }
}

const getDetail = async (reviewId) => {
  try {
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const review = await reviewModel.getDetail(reviewId)
    if (!review) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'review not found')
    }
    return review
  } catch (error) {
    throw error
  }
}

export const reviewService = { createNew, getDetail, getAll }
