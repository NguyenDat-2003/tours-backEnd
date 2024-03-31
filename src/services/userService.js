/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import bcrypt from 'bcryptjs'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    // Xử lý logic tùy dự án
    const newUser = {
      ...reqBody,
      password: await bcrypt.hash(reqBody.password, 12)
    }
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
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
    const user = await userModel.getDetail(userId)
    return user
  } catch (error) {
    throw error
  }
}

const deleteDetail = async (userId) => {
  try {
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const user = await userModel.deleteDetail(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    return { delete: 'Delete Successfully!' }
  } catch (error) {
    throw error
  }
}

const updateDetail = async (userId, reqBody) => {
  try {
    // Gọi đến tầng model để xử lý lưu bản ghi vào database sau đó trả data về cho controller
    const Tour = await userModel.updateDetail(userId, reqBody)
    if (!Tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    return { delete: 'Delete Successfully!' }
  } catch (error) {
    throw error
  }
}

export const userService = { createNew, getAll, getDetail, deleteDetail, updateDetail }
