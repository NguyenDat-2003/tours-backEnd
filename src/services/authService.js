import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

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

    return await userModel.findOneById(createdUser.insertedId)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { email, password } = reqBody

    if (!email || !password) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Please provide email and password!')
    }

    const user = await userModel.login(reqBody)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Incorrect email or password!')
    }
    const matchUser = await bcrypt.compare(password, user.password)
    if (matchUser) {
      return user
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect email or password!')
    }
  } catch (error) {
    throw error
  }
}

const findEmailResetToken = async (email) => {
  try {
    // ------------ 1) Get user based on POSTed email
    const user = await userModel.findEmailResetToken(email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'There is no user with email address.')
    }

    // ------------ 2) Generate the random reset token

    // ------------ 3) Send it to user's email

    return user
  } catch (error) {
    throw new Error(error)
  }
}

const resetPassword = async (req, hashedToken) => {
  const user = await userModel.findTokenResetPass(hashedToken)
  //----------- 2) If token has not expired, and there is user, set the new password
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Token is invalid or has expired')
  }

  const newUser = {
    ...user,
    password: await bcrypt.hash(req.body.password, 12),
    passwordConfirm: null,
    passwordResetExpires: null,
    passwordResetToken: null
  }

  //----------- 3) Update changedPasswordAt property for the user
  //----------- 4) Log the user in, send JWT

  return await userModel.updateDetail(user._id, newUser)
}

const updatePassword = async (passwordCurrent, password, passwordConfirm, userId) => {
  // 1) Get user from collection
  const user = await userModel.getDetail(userId)

  // 2) Check if POSTed current password is correct
  if (!(await bcrypt.compare(passwordCurrent, user.password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Your current password is wrong.')
  }

  // 3) If so, update password
  user.password = await bcrypt.hash(password, 12)
  delete user.passwordConfirm
  await userModel.updateDetail(user._id, user)

  //-- không sử dụng findByIdAndUpdate cho bất kì điều gì liên quan đếnm mật khẩu
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT

  return user
}

export const authService = { signUp, login, findEmailResetToken, resetPassword, updatePassword }
