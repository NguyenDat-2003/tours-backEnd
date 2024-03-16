import express from 'express'
import { tourRoute } from './tourRoute'

const Router = express.Router()

Router.use('/tours', tourRoute)

export const APIs_V1 = Router
