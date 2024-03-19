/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import bcrypt from 'bcryptjs'

const createNew = async (reqBody) => {
  try {
    // Xử lý logic tùy dự án
    const newUser = {
      ...reqBody,
      password: await bcrypt.hash(reqBody.password, 12)
    }
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const createdTour = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdTour.insertedId)
    return getNewUser
  } catch (error) {
    throw error
  }
}

const getAll = async () => {
  try {
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const User = await userModel.getAll()
    return User
  } catch (error) {
    throw error
  }
}

const getDetail = async (userId) => {
  try {
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const Tour = await userModel.getDetail(userId)
    return Tour
  } catch (error) {
    throw error
  }
}

export const userService = { createNew, getAll, getDetail }
