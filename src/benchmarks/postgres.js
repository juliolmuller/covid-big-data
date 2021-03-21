import { getConnection } from '../database/postgres'
import * as queries from '../database/postgres/queries'

async function displayBenchmark(desc, queryPromise) {
  const TEXT_LENGTH = 60
  const { duration } = await queryPromise
  const alignedDesc = desc.length < TEXT_LENGTH
    ? desc.concat(' '.repeat(TEXT_LENGTH - desc.length))
    : desc.slice(0, TEXT_LENGTH)

  console.log(alignedDesc, `${duration}ms`)
}

async function run() {
  const client = await getConnection()

  try {
    await displayBenchmark('Recuperar estados e cidades', queries.getAllPlaces(client))
    await displayBenchmark('Recuperar lista de estados', queries.getAllStates(client))
    await displayBenchmark('Recuperar cidades da Bahia', queries.getAllCities(client, 'BA'))
    await displayBenchmark('Recuperar cidades do Paraná', queries.getAllCities(client, 'PR'))
    await displayBenchmark('Recuperar cidades de São Paulo', queries.getAllCities(client, 'SP'))
    await displayBenchmark('Recuperar todos os registros', queries.getAll(client))
    await displayBenchmark('Recuperar página 1 com 50 registros', queries.getPage(client, 1, 50))
    await displayBenchmark('Recuperar página 100 com 50 registros', queries.getPage(client, 100, 50))
    await displayBenchmark('Recuperar página 1000 com 50 registros', queries.getPage(client, 1000, 50))
    await displayBenchmark('Recuperar página 1000 com 30 registros', queries.getPage(client, 1000, 30))
  } catch (error) {
    console.error(error)
  } finally {
    client.end()
  }
}

export default { run }
