import colors from 'colors'
import { getConnection } from '../../database/mongo'
import * as queries from './queries'

async function displayBenchmark(description, queryPromise) {
  const DESCRIPTION_LENGTH = 60
  const COUNT_LENGTH = 17
  const DURATION_LENGTH = 8

  try {
    const { docs, duration } = await queryPromise

    console.log('   ',
      description.padEnd(DESCRIPTION_LENGTH),
      `${docs.length} registro${docs.length === 1 ? ' ' : 's'}`.padStart(COUNT_LENGTH),
      `${duration}ms`.padStart(DURATION_LENGTH))
  } catch (error) {
    console.error(error)
  }
}

async function runBenchmarks() {
  const client = await getConnection()
  const collection = client.db().collection(process.env.DB_MONGO_COLL1)

  try {
    await displayBenchmark('Buscar lista de cidades e estados', queries.getAllPlaces(collection))
    await displayBenchmark('Buscar lista de estados', queries.getAllStates(collection))
    await displayBenchmark('Buscar lista de cidades do Acre', queries.getAllCities(collection, 'AC'))
    await displayBenchmark('Buscar lista de cidades do Amzonas', queries.getAllCities(collection, 'AM'))
    await displayBenchmark('Buscar lista de cidades da Bahia', queries.getAllCities(collection, 'BA'))
    await displayBenchmark('Buscar lista de cidades do Ceará', queries.getAllCities(collection, 'CE'))
    await displayBenchmark('Buscar lista de cidades do Distrito Federal', queries.getAllCities(collection, 'DF'))
    await displayBenchmark('Buscar lista de cidades do Mato Grosso', queries.getAllCities(collection, 'MT'))
    await displayBenchmark('Buscar lista de cidades do Paraná', queries.getAllCities(collection, 'PR'))
    await displayBenchmark('Buscar lista de cidades do Rio de Janeiro', queries.getAllCities(collection, 'RJ'))
    await displayBenchmark('Buscar lista de cidades de São Paulo', queries.getAllCities(collection, 'SP'))
    await displayBenchmark('Buscar todos os registros', queries.getAll(collection))
    await displayBenchmark('Buscar página 1 de tudo com 50 registros', queries.getPage(collection, 1, 50))
    await displayBenchmark('Buscar página 100 de tudo com 50 registros', queries.getPage(collection, 100, 50))
    await displayBenchmark('Buscar página 1000 de tudo com 50 registros', queries.getPage(collection, 1000, 50))
    await displayBenchmark('Buscar página 1000 de tudo com 30 registros', queries.getPage(collection, 1000, 30))
    await displayBenchmark('Buscar registro de Curitiba em 1/abril/2020', queries.getByDateAndPlace(collection, '2020-04-01', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar registro de Curitiba em 1/junho/2020', queries.getByDateAndPlace(collection, '2020-06-01', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar registro de Curitiba em 1/agosto/2020', queries.getByDateAndPlace(collection, '2020-08-01', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar registro de Curitiba em 1/outubro/2020', queries.getByDateAndPlace(collection, '2020-10-01', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar registro de Curitiba em 1/dezembro/2020', queries.getByDateAndPlace(collection, '2020-12-01', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar registro de Curitiba em 1/fevereiro/2021', queries.getByDateAndPlace(collection, '2021-02-01', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar somatório em Curitiba em março/2020', queries.getTotalByDateRangeAndPlace(collection, '2020-03-01', '2020-03-31', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar somatório em Curitiba em maio/2020', queries.getTotalByDateRangeAndPlace(collection, '2020-05-1', '2020-05-31', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar somatório em Curitiba em julho/2020', queries.getTotalByDateRangeAndPlace(collection, '2020-07-1', '2020-07-31', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar somatório em Curitiba em setembro/2020', queries.getTotalByDateRangeAndPlace(collection, '2020-09-1', '2020-09-30', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar somatório em Curitiba e região em novembro/2020', queries.getTotalByDateRangeAndPlace(collection, '2020-11-01', '2020-11-30', { PR: ['Curitiba', 'Araucária', 'Colombo', 'Campo Largo', 'Fazenda Rio Grande', 'Pinhais', 'São José dos Pinhais'] }))
    await displayBenchmark('Buscar somatório em Curitiba e região em janeiro/2021', queries.getTotalByDateRangeAndPlace(collection, '2021-01-01', '2021-01-31', { PR: ['Curitiba', 'Araucária', 'Colombo', 'Campo Largo', 'Fazenda Rio Grande', 'Pinhais', 'São José dos Pinhais'] }))
    await displayBenchmark('Buscar média em Curitiba em março/2020', queries.getAverageByDateRangeAndPlace(collection, '2020-03-01', '2020-03-31', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar média em Curitiba em junho/2020', queries.getAverageByDateRangeAndPlace(collection, '2020-06-01', '2020-06-30', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar média em Curitiba em setembro/2020', queries.getAverageByDateRangeAndPlace(collection, '2020-09-01', '2020-09-30', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar média em Curitiba e região em setembro/2020', queries.getAverageByDateRangeAndPlace(collection, '2020-09-01', '2020-09-30', { PR: ['Curitiba', 'Araucária', 'Colombo', 'Campo Largo', 'Fazenda Rio Grande', 'Pinhais', 'São José dos Pinhais'] }))
    await displayBenchmark('Buscar percentual em Curitiba em 1/março/2021', queries.getPercentageByDateRangeAndPlace(collection, { PR: 'Curitiba' }, '2021-03-01'))
    await displayBenchmark('Buscar percentual atual em todas as cidades', queries.getPercentageByDateRangeAndPlace(collection))
    await displayBenchmark('Buscar percentual em Curitiba em 19/março/2021', queries.getPercentageByDateRangeAndPlace(collection, { PR: 'Curitiba' }))
    await displayBenchmark('Buscar percentual em Curitiba e região em 1/março/2021', queries.getPercentageByDateRangeAndPlace(collection, { PR: ['Curitiba', 'Araucária', 'Colombo', 'Campo Largo', 'Fazenda Rio Grande', 'Pinhais', 'São José dos Pinhais'] }, '2021-03-01'))
    await displayBenchmark('Buscar percentual em Curitiba e região em 19/março/2021', queries.getPercentageByDateRangeAndPlace(collection, { PR: ['Curitiba', 'Araucária', 'Colombo', 'Campo Largo', 'Fazenda Rio Grande', 'Pinhais', 'São José dos Pinhais'] }))
  } catch (error) {
    throw error
  } finally {
    client.close()
  }
}

export default runBenchmarks
