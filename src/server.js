import express from 'express'
import exitHook from 'async-exit-hook'
import helmet from 'helmet'

import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()
  app.use(helmet())

  app.use(express.json({ limit: '10kb' }))

  app.use('/v1', APIs_V1)

  app.use(errorHandlingMiddleware)

  app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
    console.log(`Hello ${env.AUTHOR}, I am running at ${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
  })

  exitHook(() => {
    CLOSE_DB()
  })
}

;(async () => {
  try {
    await CONNECT_DB()

    // Khởi động server sau khi connect thành công
    START_SERVER()
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
})()
