import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to perform this action'))
    }

    next()
  }
}
