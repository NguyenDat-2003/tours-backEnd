import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { tourValidation } from '~/validations/tourValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'test route' })
  })
  .post(tourValidation.creatNew)

export const tourRoute = Router
