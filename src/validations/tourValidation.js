import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(10).max(40).trim().strict(),
    duration: Joi.number().required(),
    maxGroupSize: Joi.number().required(),
    difficulty: Joi.string().required().valid('easy', 'medium', 'difficult'),
    price: Joi.number().required(),
    priceDiscount: Joi.number().required(),

    summary: Joi.string().required().trim().strict(),
    imageCover: Joi.string().required().trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const tourValidation = { createNew }
