import { StatusCodes } from 'http-status-codes'

const creatNew = async (req, res, next) => {
  try {
    // next()
    res.status(StatusCodes.CREATED).json({ message: 'controller create test route' })
  } catch (error) {
    next(error)
  }
}

export const tourController = { creatNew }
