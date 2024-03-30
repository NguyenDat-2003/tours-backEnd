import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const signToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    //---JWT hết hạn sau 30 ngày
    expiresIn: env.JWT_EXPIRES_IN
  })
}

const signUp = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Xử lý logic tùy dự án
    const newUser = {
      ...reqBody,
      password: await bcrypt.hash(reqBody.password, 12)
    }
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const createdUser = await userModel.createNew(newUser)
    const user = await userModel.findOneById(createdUser.insertedId)

    let token = signToken(user._id)
    return { token, user }
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { email, password } = reqBody

    if (!email || !password) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Please provide email and password!')
    }

    const user = await userModel.login(reqBody)
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect email or password!')
    }

    const matchUser = await bcrypt.compare(password, user.password)
    if (matchUser) {
      let token = signToken(user._id)
      return { token, user }
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect email or password!')
    }
  } catch (error) {
    throw error
  }
}

export const authService = { signUp, login }
