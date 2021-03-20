import mongo from './database/mongo'

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
