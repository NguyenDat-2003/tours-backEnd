import { StatusCodes } from 'http-status-codes'
import { tourService } from '~/services/tourService'

const createNew = async (req, res, next) => {
  try {
    const createdTour = await tourService.createNew(req.body)
    console.log(createdTour)
    return res.status(StatusCodes.CREATED).json(createdTour)
  } catch (error) {
    next(error)
  }
}

export const tourController = { createNew }
