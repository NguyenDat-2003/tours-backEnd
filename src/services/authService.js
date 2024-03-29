import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'

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

    let token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      //---JWT hết hạn sau 90 ngày
      expiresIn: env.JWT_EXPIRES_IN
    })
    return { token, user }
  } catch (error) {
    throw error
  }
}

export const authService = { signUp }
