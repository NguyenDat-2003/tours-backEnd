import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    return res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const User = await userService.getAll()
    return res.status(StatusCodes.CREATED).json(User)
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const User = await userService.getDetail(req.params.id)
    return res.status(StatusCodes.CREATED).json(User)
  } catch (error) {
    next(error)
  }
}
const deleteDetail = async (req, res, next) => {
  try {
    const User = await userService.deleteDetail(req.params.id)
    return res.status(StatusCodes.CREATED).json(User)
  } catch (error) {
    next(error)
  }
}

const updateDetail = async (req, res, next) => {
  try {
    const User = await userService.updateDetail(req.params.id, req.body)
    return res.status(StatusCodes.CREATED).json(User)
  } catch (error) {
    next(error)
  }
}

export const userController = { createNew, getAll, getDetail, deleteDetail, updateDetail }
