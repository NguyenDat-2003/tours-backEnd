import express from 'express'
import { authController } from '~/controllers/authcontroller'
import { tourController } from '~/controllers/tourController'
import { tourValidation } from '~/validations/tourValidation'
import { reviewRoute } from './reviewRoute'

const Router = express.Router()

Router.use('/:tourId/reviews', reviewRoute)

Router.route('/').get(tourController.getAll).post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourValidation.createNew, tourController.createNew)

Router.route('/:id')
  .get(tourController.getDetail)
  .put(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourValidation.update, tourController.updateDetail)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourValidation.deleteItem, tourController.deleteDetail)

export const tourRoute = Router
