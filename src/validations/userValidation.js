import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    userName: Joi.string().required().trim().strict(),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .message('Invalid Email'),
    password: Joi.string().required().min(8),
    passwordConfirm: Joi.any().valid(Joi.ref('password')).required().messages({ 'any.only': 'Password Confirm does not match' })
  })

  try {
    // await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    await correctCondition.validateAsync(req.body, { allowUnknown: true })
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

const updateMe = async (req, res, next) => {
  const correctCondition = Joi.object({
    userName: Joi.string().required().trim().strict(),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .message('Invalid Email')
  })

  try {
    // await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    await correctCondition.validateAsync(req.body, { allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updatePass = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentPassword: Joi.string().required().min(8),
    newPassword: Joi.string().required().min(8),
    confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({ 'any.only': 'Password Confirm does not match' })
  })

  try {
    // await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    await correctCondition.validateAsync(req.body, { allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const userValidation = { createNew, deleteItem, updateMe, updatePass }
