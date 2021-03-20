import mongo from './database/mongo'
import postgres from './database/postgres'

mongo.getConnection().then(async (client) => {
  try {
    const dbs = await client.db().admin().listDatabases()

    console.log(dbs)
  } catch (error) {
    console.error(error)
  } finally {
    client.close()
  }
})

postgres.getConnection().then(async (client) => {
  try {
    const result = await client.query('SELECT NOW()')

    console.log(result)
  } catch (error) {
    console.error(error)
  } finally {
    client.end()
  }
})
