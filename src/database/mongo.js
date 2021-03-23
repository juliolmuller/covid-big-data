import { MongoClient } from 'mongodb'
import csv from 'csvtojson'
import path from 'path'

const connection = {
  host: process.env.DB_MONGO_HOST,
  port: process.env.DB_MONGO_PORT,
  username: process.env.DB_MONGO_USERNAME,
  password: process.env.DB_MONGO_PASSWORD,
  database: process.env.DB_MONGO_DATABASE,
  asURL() {
    const credentials = this.username ? `${this.username}:${this.password}@` : ''

    return `mongodb://${credentials}${this.host}:${this.port}/${this.database}`
  },
}

export async function loadDataset() {
  const client = new MongoClient(connection.asURL(), { useUnifiedTopology: true })
  const projectRoot = path.resolve(__dirname, '..', '..')
  const datasetFile = path.resolve(projectRoot, process.env.DATASET_FILE)
  const dataset = await csv({
    checkType: true,
    colParser: {
      estimated_population_2019: (value) => Number(value) || 1,
      estimated_population: (value) => Number(value) || 1,
      last_available_date: (value) => new Date(value),
      date: (value) => new Date(value),
    },
  }).fromFile(datasetFile)

  try {
    await client.connect()
    await client.db().dropDatabase()
    await client.db()
      .collection(process.env.DB_MONGO_COLL1)
      .insertMany(dataset)
  } catch (error) {
    console.error(error)
  } finally {
    client.close()
  }
}

export async function getConnection() {
  const client = new MongoClient(connection.asURL(), { useUnifiedTopology: true })

  await client.connect()

  return client
}

export default {
  loadDataset,
  getConnection,
}
