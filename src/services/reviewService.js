/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'

import { reviewModel } from '~/models/reviewModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const createdReview = await reviewModel.createNew(reqBody)
    const getNewReview = await reviewModel.getDetail(createdReview.insertedId)
    return getNewReview
  } catch (error) {
    throw error
  }
}

const getAll = async () => {
  try {
    return await reviewModel.getAll()
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
