import express from 'express'
import { authController } from '~/controllers/authcontroller'
import { reviewController } from '~/controllers/reviewController'
import { reviewValidation } from '~/validations/reviewValidation'

const Router = express.Router({ mergeParams: true })

Router.route('/')
  .post(authController.protect, authController.restrictTo('user'), reviewValidation.createNew, reviewController.createReview)
  .get(authController.protect, reviewController.getAllReviews)

export const reviewRoute = Router
