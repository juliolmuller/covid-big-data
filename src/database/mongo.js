import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const host = process.env.DB_MONGO_HOST
const port = process.env.DB_MONGO_PORT
const database = process.env.DB_MONGO_DATABASE
const url = `${host}:${port}/${database}`

export async function getConnection() {
  const client = new MongoClient(url)

  await client.connect()

  return client
}

export default { getConnection }
