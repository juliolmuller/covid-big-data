import { MongoClient } from 'mongodb'
import csv from 'csvtojson'
import path from 'path'

const connection = {
  host: process.env.DB_MONGO_HOST,
  port: process.env.DB_MONGO_PORT,
  database: process.env.DB_MONGO_DATABASE,
  username: process.env.DB_MONGO_USERNAME,
  password: process.env.DB_MONGO_PASSWORD,
  asURL() {
    const credentials = this.username ? `${this.username}:${this.password}@` : ''

    return `mongodb://${credentials}${this.host}:${this.port}/${this.database}`
  },
}

export async function loadDataset() {
  const client = new MongoClient(connection.asURL())
  const datasetFolder = path.resolve(__dirname, '..', '..', 'dataset')
  const datasetFile = path.resolve(datasetFolder, 'casos-full.csv')
  const dataset = await csv().fromFile(datasetFile)

  try {
    await client.connect()
    await client.db().dropDatabase()
    await client.db().collection('covid_cases').insertMany(dataset)
  } catch (error) {
    console.error(error)
  } finally {
    client.close()
  }
}

export async function getConnection() {
  const client = new MongoClient(connection.asURL())

  await client.connect()

  return client
}

export default {
  loadDataset,
  getConnection,
}
