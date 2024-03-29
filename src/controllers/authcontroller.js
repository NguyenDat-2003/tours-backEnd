import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'

const signUp = async (req, res, next) => {
  try {
    const createdUser = await authService.signUp(req.body)
    return res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

export const authController = { signUp }
