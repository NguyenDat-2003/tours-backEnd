import express from 'express'
import { authController } from '~/controllers/authcontroller'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/signup').post(userValidation.createNew, authController.signUp)
Router.route('/login').post(authController.login)

Router.use(authController.protect, authController.restrictTo('admin'))
Router.route('/').get(userController.getAll).post(userValidation.createNew, userController.createNew)

Router.route('/:id').get(userController.getDetail).delete(userValidation.deleteItem, userController.deleteDetail).put(userValidation.update, userController.updateDetail)

export const userRoute = Router
