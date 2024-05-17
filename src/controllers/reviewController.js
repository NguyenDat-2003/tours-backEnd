import { StatusCodes } from 'http-status-codes'
import { reviewService } from '~/services/reviewService'

const createReview = async (req, res, next) => {
  try {
    const createdReview = await reviewService.createNew(req)
    return res.status(StatusCodes.CREATED).json(createdReview)
  } catch (error) {
    next(error)
  }
}

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getAll()
    return res.status(StatusCodes.CREATED).json(reviews)
  } catch (error) {
    next(error)
  }
}

const getReview = async (req, res, next) => {
  try {
    const reviews = await reviewService.getDetail(req.params.id)
    return res.status(StatusCodes.CREATED).json(reviews)
  } catch (error) {
    next(error)
  }
}

const updateDetail = async (req, res, next) => {
  try {
    const review = await reviewService.updateDetail(req.params.id, req.body)
    return res.status(StatusCodes.CREATED).json(review)
  } catch (error) {
    next(error)
  }
}

const deleteDetail = async (req, res, next) => {
  try {
    const review = await reviewService.deleteDetail(req.params.id)
    return res.status(StatusCodes.OK).json(review)
  } catch (error) {
    next(error)
  }
}

export const reviewController = { createReview, getAllReviews, getReview, updateDetail, deleteDetail }
