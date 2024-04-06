import express from 'express'
import { tourRoute } from './tourRoute'
import { userRoute } from './userRoute'
import { reviewRoute } from './reviewRoute'

const Router = express.Router()

Router.use('/tours', tourRoute)
Router.use('/users', userRoute)
Router.use('/reviews', reviewRoute)

export const APIs_V1 = Router
