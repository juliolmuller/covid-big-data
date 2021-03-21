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

export async function getConnection() {
  const client = new Client(connection)

  await client.connect()

  return client
}

export default { getConnection }
