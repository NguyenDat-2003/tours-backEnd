import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/').get(userController.getAll).post(userValidation.createNew, userController.createNew)

Router.route('/:id').get(userController.getDetail).delete(userValidation.deleteItem, userController.deleteDetail).put(userValidation.update, userController.updateDetail)

export const userRoute = Router
