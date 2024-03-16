import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { tourController } from '~/controllers/tourController'
import { tourValidation } from '~/validations/tourValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'test route' })
  })
  .post(tourValidation.creatNew, tourController.creatNew)

export const tourRoute = Router
