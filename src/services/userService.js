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
    const getNewUser = await userModel.getDetail(createdUser.insertedId)
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
    delete user.password
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

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

const updateMe = async (reqUserId, reqBody) => {
  try {
    const filteredBody = filterObj(reqBody, 'userName', 'email', 'avatar')

    await userModel.updateMe(reqUserId, filteredBody)
    return { update: 'Update Successfully!' }
  } catch (error) {
    throw error
  }
}

const deleteMe = async (reqUser) => {
  try {
    const newUser = {
      ...reqUser,
      _destroy: true
    }
    await userModel.deleteMe(newUser)
    return { delete: 'Delete Successfully!' }
  } catch (error) {
    throw error
  }
}

export const userService = { createNew, getAll, getDetail, deleteDetail, updateDetail, updateMe, deleteMe }
