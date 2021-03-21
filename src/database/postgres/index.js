import { readFileSync } from 'fs'
import path from 'path'
import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connection = {
  host: process.env.DB_PG_HOST,
  port: process.env.DB_PG_PORT,
  database: process.env.DB_PG_DATABASE,
  user: process.env.DB_PG_USERNAME,
  password: process.env.DB_PG_PASSWORD,
}

export async function loadDataset() {
  const SQL_COMMANDS_DELIMITER = ';'
  const DATASET_FILE_NAME = 'casos-full.csv'
  const { database, ...rootConnection } = connection
  const rootClient = new Client(rootConnection)
  const dbClient = new Client(connection)
  const datasetFolder = path.resolve(__dirname, '..', '..', '..', 'dataset')
  const scriptFile = path.resolve(datasetFolder, 'script-pg.sql')
  const datasetFile = path.resolve(datasetFolder, DATASET_FILE_NAME)
  const rawSql = readFileSync(scriptFile, { encoding: 'utf8', flag: 'r' })
  const [sqlDropDatabse, sqlCreateDatabase, ...sqlCommands] = rawSql
    .replace(`C:\\path\\to\\project\\dataset\\${DATASET_FILE_NAME}`, datasetFile)
    .split(SQL_COMMANDS_DELIMITER)

  try {
    await rootClient.connect()
    await rootClient.query(sqlDropDatabse)
    await rootClient.query(sqlCreateDatabase)

    await dbClient.connect()
    await dbClient.query(sqlCommands.join(SQL_COMMANDS_DELIMITER))
  } catch (error) {
    console.error(error)
  } finally {
    rootClient.end()
    dbClient.end()
  }
}

export async function getConnection() {
  const client = new Client(connection)

  await client.connect()

  return client
}

export default {
  loadDataset,
  getConnection,
}
