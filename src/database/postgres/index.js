import { readFileSync } from 'fs'
import path from 'path'
import { Client } from 'pg'

const connection = {
  host: process.env.DB_PG_HOST,
  port: process.env.DB_PG_PORT,
  user: process.env.DB_PG_USERNAME,
  password: process.env.DB_PG_PASSWORD,
  database: process.env.DB_PG_DATABASE,
}

export async function loadDataset() {
  const { database, ...rootConnection } = connection
  const rootClient = new Client(rootConnection)
  const dbClient = new Client(connection)
  const projectRoot = path.resolve(__dirname, '..', '..', '..')
  const datasetFile = path.resolve(projectRoot, process.env.DATASET_FILE)
  const scriptFile = path.resolve(projectRoot, process.env.SQL_SCRIPTS_FILE)
  const rawSql = readFileSync(scriptFile, { encoding: 'utf8', flag: 'r' })
  const [sqlDropDatabase, sqlCreateDatabase, ...sqlCommands] = rawSql
    .replace(/<absolute path to DATASET_FILE>/g, datasetFile)
    .replace(/<DB_PG_DATABASE>/g, process.env.DB_PG_DATABASE)
    .replace(/<DB_PG_TABLE>/g, process.env.DB_PG_TABLE)
    .split(process.env.SQL_DELIMITER)

  try {
    await rootClient.connect()
    await rootClient.query(sqlDropDatabase)
    await rootClient.query(sqlCreateDatabase)

    await dbClient.connect()
    await dbClient.query(sqlCommands.join(process.env.SQL_DELIMITER))
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
