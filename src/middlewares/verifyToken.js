import { StatusCodes } from 'http-status-codes'
import { promisify } from 'util'
import jwt from 'jsonwebtoken'

import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'

export const verifyToken = async (req, res, next) => {
  // 1) Getting token and check of it's there
  const token = req.cookies.token

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'You are not logged in! Please log in to get access.'))
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, env.JWT_SECRET)
  // 3) Check if user still exists
  const currentUser = await userModel.getDetail(decoded.id)
  if (!currentUser) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'The user belonging to this token does no longer exist.'))
  }

  req.user = currentUser
  next()
}
