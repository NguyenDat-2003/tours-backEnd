import express from 'express'
import { authController } from '~/controllers/authcontroller'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.post('/signup', userValidation.createNew, authController.signUp)
Router.post('/login', authController.login)

Router.post('/forgotPassword', authController.forgotPassword)
Router.put('/resetPassword/:token', userValidation.update, authController.resetPassword)

//---Protect all routes after this middleware
Router.use(authController.protect)

Router.put('/updatePassword', authController.updatePassword)
Router.put('/updateMe', userController.updateMe)
Router.get('/me', userController.getMe, userController.getDetail)
Router.delete('/deleteMe', userController.deleteMe)

Router.use(authController.restrictTo('admin'))
Router.route('/').get(userController.getAll).post(userValidation.createNew, userController.createNew)

Router.route('/:id').get(userController.getDetail).delete(userValidation.deleteItem, userController.deleteDetail).put(userValidation.update, userController.updateDetail)

export const userRoute = Router
