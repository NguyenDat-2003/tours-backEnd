import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const creatNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(10).max(40).trim().strict(),
    duration: Joi.number().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    res.status(StatusCodes.CREATED).json({ message: 'create test route' })
    next()
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: new Error(error).message })
  }
}

export const tourValidation = { creatNew }
