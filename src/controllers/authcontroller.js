import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import jwt from 'jsonwebtoken'

import { authService } from '~/services/authService'
import ApiError from '~/utils/ApiError'
// import { userModel } from '~/models/userModel'
import { sendEmail } from '~/utils/email'

const createSignToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      //--Đổi thời gian 30 ngày lưu cookie sang milisecond
      Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }
  if (env.BUILD_MODE === 'production') cookieOptions.secure = true

  const { password, ...userInfo } = user

  res.cookie('token', token, cookieOptions)

  return res.status(statusCode).json(userInfo)
}

const signToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    //---JWT hết hạn sau 30 ngày
    expiresIn: env.JWT_EXPIRES_IN
  })
}

const signUp = async (req, res, next) => {
  try {
    const createdUser = await authService.signUp(req.body)
    createSignToken(createdUser, StatusCodes.CREATED, res)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body)
    createSignToken(user, StatusCodes.OK, res)
  } catch (error) {
    next(error)
  }
}

const logout = (req, res) => {
  res.clearCookie('token').status(StatusCodes.OK).json({ status: 'Logout Successful' })
}

const forgotPassword = async (req, res, next) => {
  try {
    const user = await authService.findEmailResetToken(req.body.email)
    const resetURL = `${req.protocol}://${req.get('host')}/v1/users/resetPassword/${user.passwordResetToken}`

    const message = `Forgot your password? Submit a PATCH request with your new password 
  and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      })

      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Token sent to email!'
      })
    } catch (err) {
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined

      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'There was an error sending the email. Try again later!'))
    }
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    //----------- 1) Get user based on the token
    const hashedToken = req.params.token
    // const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await authService.resetPassword(req, hashedToken)
    createSignToken(user, StatusCodes.OK, res)
  } catch (error) {
    next(error)
  }
}

const updatePassword = async (req, res, next) => {
  try {
    const { passwordCurrent, password, passwordConfirm } = req.body

    const user = await authService.updatePassword(passwordCurrent, password, passwordConfirm, req.user._id)
    createSignToken(user, StatusCodes.OK, res)
  } catch (error) {
    next(error)
  }
}

export const authController = { signUp, login, forgotPassword, resetPassword, updatePassword, logout }
