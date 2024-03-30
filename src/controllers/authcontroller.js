import { StatusCodes } from 'http-status-codes'
import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import { authService } from '~/services/authService'
import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'

const protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'You are not logged in! Please log in to get access.'))
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3) Check if user still exists
  const currentUser = await userModel.findOneById(decoded.id)
  if (!currentUser) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'The user belonging to this token does no longer exist.'))
  }

  req.user = currentUser
  next()
}

const signUp = async (req, res, next) => {
  try {
    const createdUser = await authService.signUp(req.body)
    return res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const User = await authService.login(req.body)
    return res.status(StatusCodes.OK).json(User)
  } catch (error) {
    next(error)
  }
}

export const authController = { signUp, login, protect }
