import express from 'express'
import { reviewController } from '~/controllers/reviewController'
import { reviewValidation } from '~/validations/reviewValidation'
import { verifyToken } from '~/middlewares/verifyToken'
import { restrictTo } from '~/middlewares/restrictTo'

const Router = express.Router({ mergeParams: true })

Router.use(verifyToken)

Router.route('/').get(reviewController.getAllReviews).post(restrictTo('admin', 'user'), reviewValidation.createNew, reviewController.createReview)

Router.route('/:id')
  .get(reviewController.getReview)
  .put(restrictTo('user', 'admin'), reviewValidation.update, reviewController.updateDetail)
  .delete(restrictTo('user', 'admin'), reviewController.deleteDetail)

export const reviewRoute = Router
