import { MongoClient, ServerApiVersion } from 'mongodb'

const MONGODB_URI = 'mongodb+srv://datdev:ok34BX1bvvhQrHmx@cluster-datdev.w1qqpiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-DatDev'

const DATABASE_NAME = 'tours-app-datdev'

let toursDatabaseInstance = null

const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()

  toursDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

export const GET_DB = () => {
  if (!toursDatabaseInstance) throw new Error('Must connect Database first')
  return toursDatabaseInstance
}

export const CLOSE_DB = async () => {
  await toursDatabaseInstance.close()
}
