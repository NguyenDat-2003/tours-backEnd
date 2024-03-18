import { StatusCodes } from 'http-status-codes'
import { tourService } from '~/services/tourService'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    const createdTour = await tourService.createNew(req.body)
    return res.status(StatusCodes.CREATED).json(createdTour)
  } catch (error) {
    next(error)
  }
}
const getDetail = async (req, res, next) => {
  try {
    const Tour = await tourService.getDetail(req.params.id)
    return res.status(StatusCodes.CREATED).json(Tour)
  } catch (error) {
    next(error)
  }
}
const getAll = async (req, res, next) => {
  try {
    const Tour = await tourService.getAll()
    return res.status(StatusCodes.CREATED).json(Tour)
  } catch (error) {
    next(error)
  }
}

const deleteDetail = async (req, res, next) => {
  try {
    const Tour = await tourService.deleteDetail(req.params.id)
    return res.status(StatusCodes.CREATED).json(Tour)
  } catch (error) {
    next(error)
  }
}

const updateDetail = async (req, res, next) => {
  try {
    const Tour = await tourService.updateDetail(req.params.id, req.body)
    return res.status(StatusCodes.CREATED).json(Tour)
  } catch (error) {
    next(error)
  }
}

export const tourController = { createNew, getDetail, getAll, deleteDetail, updateDetail }
