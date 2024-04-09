import express from 'express'
import { authController } from '~/controllers/authcontroller'
import { reviewController } from '~/controllers/reviewController'
import { reviewValidation } from '~/validations/reviewValidation'

const Router = express.Router({ mergeParams: true })

Router.use(authController.protect)

Router.route('/').get(reviewController.getAllReviews).post(authController.restrictTo('user'), reviewValidation.createNew, reviewController.createReview)

Router.route('/:id')
  .get(reviewController.getReview)
  .put(authController.restrictTo('user', 'admin'), reviewValidation.update, reviewController.updateDetail)
  .delete(authController.restrictTo('user', 'admin'), reviewController.deleteDetail)

export const reviewRoute = Router
