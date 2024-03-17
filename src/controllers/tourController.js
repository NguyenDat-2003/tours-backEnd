import { StatusCodes } from 'http-status-codes'
import { tourService } from '~/services/tourService'

const creatNew = async (req, res, next) => {
  try {
    const createdTour = await tourService.creatNew(req.body)
    res.status(StatusCodes.CREATED).json({ tour: createdTour })
  } catch (error) {
    next(error)
  }
}

export const tourController = { creatNew }
