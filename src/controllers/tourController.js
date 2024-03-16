import { StatusCodes } from 'http-status-codes'

const creatNew = async (req, res, next) => {
  try {
    res.status(StatusCodes.CREATED).json({ message: 'controller create test route' })
    next()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const tourController = { creatNew }
