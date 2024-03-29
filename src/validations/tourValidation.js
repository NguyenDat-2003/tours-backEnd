import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(10).max(40).trim().strict(),
    duration: Joi.number(),
    maxGroupSize: Joi.number(),
    difficulty: Joi.string().valid('easy', 'medium', 'difficult'),
    price: Joi.number(),

    summary: Joi.string().trim().strict(),
    imageCover: Joi.string().trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(3).max(50).trim().strict(),
    duration: Joi.number(),
    maxGroupSize: Joi.number(),
    difficulty: Joi.string().valid('easy', 'medium', 'difficult'),
    ratingsAverage: Joi.number().min(1).max(5).default(4.5),
    ratingsQuantity: Joi.number().default(0),
    price: Joi.number(),
    priceDiscount: Joi.number().less(Joi.ref('price')),
    summary: Joi.string().trim().strict(),
    imageCover: Joi.string().trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteItem = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message('Your item fails to match the Object Id pattern!')
  })

  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const tourValidation = { createNew, update, deleteItem }
