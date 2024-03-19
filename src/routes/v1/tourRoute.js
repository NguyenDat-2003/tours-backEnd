import express from 'express'
import { tourController } from '~/controllers/tourController'
import { tourValidation } from '~/validations/tourValidation'

const Router = express.Router()

Router.route('/').get(tourController.getAll).post(tourValidation.createNew, tourController.createNew)

Router.route('/:id').get(tourController.getDetail).delete(tourValidation.deleteItem, tourController.deleteDetail).put(tourValidation.update, tourController.updateDetail)

export const tourRoute = Router
