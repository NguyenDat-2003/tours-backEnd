import express from 'express'
import { tourController } from '~/controllers/tourController'
import { tourValidation } from '~/validations/tourValidation'
import { reviewRoute } from './reviewRoute'
import { verifyToken } from '~/middlewares/verifyToken'
import { restrictTo } from '~/middlewares/restrictTo'

const Router = express.Router()

Router.use('/:tourId/reviews', reviewRoute)

Router.route('/').get(tourController.getAll).post(verifyToken, restrictTo('admin', 'lead-guide'), tourValidation.createNew, tourController.createNew)

Router.route('/:id')
  .get(tourController.getDetail)
  .put(verifyToken, restrictTo('admin', 'lead-guide'), tourValidation.update, tourController.updateDetail)
  .delete(verifyToken, restrictTo('admin', 'lead-guide'), tourValidation.deleteItem, tourController.deleteDetail)

export const tourRoute = Router
