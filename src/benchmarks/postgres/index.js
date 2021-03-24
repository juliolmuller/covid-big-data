import { getConnection } from '../../database/postgres'
import * as queries from './queries'

// Executar operação e apresentar resultado na tela
async function displayBenchmark(description, queryPromise) {
  const DESCRIPTION_LENGTH = 60
  const COUNT_LENGTH = 17
  const DURATION_LENGTH = 8

  try {
    const { rows, duration } = await queryPromise

    console.log('   ',
      description.padEnd(DESCRIPTION_LENGTH),
      `${rows.length} registro${rows.length === 1 ? ' ' : 's'}`.padStart(COUNT_LENGTH),
      `${duration}ms`.padStart(DURATION_LENGTH))
  } catch (error) {
    console.error(error)
  }
}

// Criar conexão com banco e executar todas
async function runBenchmarks() {
  const client = await getConnection()

  try {
    await displayBenchmark('Buscar lista de cidades e estados', queries.getAllPlaces(client))
    await displayBenchmark('Buscar lista de estados', queries.getAllStates(client))
    await displayBenchmark('Buscar lista de cidades do Acre', queries.getAllCities(client, 'AC'))
    await displayBenchmark('Buscar lista de cidades do Amzonas', queries.getAllCities(client, 'AM'))
    await displayBenchmark('Buscar lista de cidades da Bahia', queries.getAllCities(client, 'BA'))
    await displayBenchmark('Buscar lista de cidades do Ceará', queries.getAllCities(client, 'CE'))
    await displayBenchmark('Buscar lista de cidades do Distrito Federal', queries.getAllCities(client, 'DF'))
    await displayBenchmark('Buscar lista de cidades do Mato Grosso', queries.getAllCities(client, 'MT'))
    await displayBenchmark('Buscar lista de cidades do Paraná', queries.getAllCities(client, 'PR'))
    await displayBenchmark('Buscar lista de cidades do Rio de Janeiro', queries.getAllCities(client, 'RJ'))
    await displayBenchmark('Buscar lista de cidades de São Paulo', queries.getAllCities(client, 'SP'))
    await displayBenchmark('Buscar todos os registros', queries.getAll(client))
    await displayBenchmark('Buscar página 1 de tudo com 50 registros', queries.getPage(client, 1, 50))
    await displayBenchmark('Buscar página 100 de tudo com 50 registros', queries.getPage(client, 100, 50))
    await displayBenchmark('Buscar página 1000 de tudo com 50 registros', queries.getPage(client, 1000, 50))
    await displayBenchmark('Buscar página 1000 de tudo com 30 registros', queries.getPage(client, 1000, 30))
    await displayBenchmark('Buscar registro de Curitiba em 1/abril/2020', queries.getByDateAndPlace(client, '2020-4-1', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar registro de Curitiba em 1/junho/2020', queries.getByDateAndPlace(client, '2020-6-1', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar registro de Curitiba em 1/agosto/2020', queries.getByDateAndPlace(client, '2020-8-1', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar registro de Curitiba em 1/outubro/2020', queries.getByDateAndPlace(client, '2020-10-1', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar registro de Curitiba em 1/dezembro/2020', queries.getByDateAndPlace(client, '2020-12-1', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar registro de Curitiba em 1/fevereiro/2021', queries.getByDateAndPlace(client, '2021-2-1', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar somatório em Curitiba em março/2020', queries.getTotalByDateRangeAndPlace(client, '2020-3-1', '2020-3-31', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar somatório em Curitiba em maio/2020', queries.getTotalByDateRangeAndPlace(client, '2020-5-1', '2020-5-31', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar somatório em Curitiba em julho/2020', queries.getTotalByDateRangeAndPlace(client, '2020-7-1', '2020-7-31', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar somatório em Curitiba em setembro/2020', queries.getTotalByDateRangeAndPlace(client, '2020-9-1', '2020-9-30', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar somatório em Curitiba e região em novembro/2020', queries.getTotalByDateRangeAndPlace(client, '2020-11-1', '2020-11-30', { PR: ['Curitiba', 'Araucária', 'Colombo', 'Campo Largo', 'Fazenda Rio Grande', 'Pinhais', 'São José dos Pinhais'] }))
    await displayBenchmark('Buscar somatório em Curitiba e região em janeiro/2021', queries.getTotalByDateRangeAndPlace(client, '2021-1-1', '2021-1-31', { PR: ['Curitiba', 'Araucária', 'Colombo', 'Campo Largo', 'Fazenda Rio Grande', 'Pinhais', 'São José dos Pinhais'] }))
    await displayBenchmark('Buscar média em Curitiba em março/2020', queries.getAverageByDateRangeAndPlace(client, '2020-3-1', '2020-3-31', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar média em Curitiba em junho/2020', queries.getAverageByDateRangeAndPlace(client, '2020-6-1', '2020-6-30', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar média em Curitiba em setembro/2020', queries.getAverageByDateRangeAndPlace(client, '2020-9-1', '2020-9-30', { PR: 'Curitiba' }))
    await displayBenchmark('Buscar média em Curitiba e região em setembro/2020', queries.getAverageByDateRangeAndPlace(client, '2020-9-1', '2020-9-30', { PR: ['Curitiba', 'Araucária', 'Colombo', 'Campo Largo', 'Fazenda Rio Grande', 'Pinhais', 'São José dos Pinhais'] }))
    await displayBenchmark('Buscar percentual em Curitiba em 1/março/2021', queries.getPercentageByDateRangeAndPlace(client, { PR: 'Curitiba' }, '2021-3-1'))
    await displayBenchmark('Buscar percentual atual em todas as cidades', queries.getPercentageByDateRangeAndPlace(client))
    await displayBenchmark('Buscar percentual em Curitiba em 19/março/2021', queries.getPercentageByDateRangeAndPlace(client, { PR: 'Curitiba' }))
    await displayBenchmark('Buscar percentual em Curitiba e região em 1/março/2021', queries.getPercentageByDateRangeAndPlace(client, { PR: ['Curitiba', 'Araucária', 'Colombo', 'Campo Largo', 'Fazenda Rio Grande', 'Pinhais', 'São José dos Pinhais'] }, '2021-3-1'))
    await displayBenchmark('Buscar percentual em Curitiba e região em 19/março/2021', queries.getPercentageByDateRangeAndPlace(client, { PR: ['Curitiba', 'Araucária', 'Colombo', 'Campo Largo', 'Fazenda Rio Grande', 'Pinhais', 'São José dos Pinhais'] }))
  } catch (error) {
    throw error
  } finally {
    client.end()
  }
}

export default runBenchmarks
