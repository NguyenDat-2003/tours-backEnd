import express from 'express'
import { tourRoute } from './tourRoute'
import { userRoute } from './userRoute'

const Router = express.Router()

Router.use('/tours', tourRoute)
Router.use('/users', userRoute)

export const APIs_V1 = Router
