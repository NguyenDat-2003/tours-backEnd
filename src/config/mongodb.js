import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let toursDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()

  toursDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
  if (!toursDatabaseInstance) throw new Error('Must connect Database first')
  return toursDatabaseInstance
}

export const CLOSE_DB = async () => {
  await toursDatabaseInstance.close()
}
