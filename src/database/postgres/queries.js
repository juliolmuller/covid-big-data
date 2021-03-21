import * as sqlBuilder from './sql-builder'

// Executa a query e retorna um objeto com os timestamps
async function queryRunner(client, sql) {
  const startTimestamp = Date.now()
  const { rows } = await client.query(sql)
  const endTimestamp = Date.now()
  const duration = endTimestamp - startTimestamp

  return {
    startTimestamp,
    endTimestamp,
    duration,
    rows,
  }
}

// Recupera a lista de estados e cidades
export function getAllPlaces(client) {
  const sql = sqlBuilder.getAllPlaces()

  return queryRunner(client, sql)
}

// Recupera a lista de estados
export function getAllStates(client) {
  const sql = sqlBuilder.getAllStates()

  return queryRunner(client, sql)
}

// Recupera a lista de estados para o dado estado
export function getAllCities(client, state) {
  const sql = sqlBuilder.getAllCities(state)

  return queryRunner(client, sql)
}

// Recupera a lista de estados para o dado estado
export function getAll(client, fields) {
  const sql = sqlBuilder.getAll(fields)

  return queryRunner(client, sql)
}

// Recupera a lista de estados para o dado estado
export function getPage(client, page, limit, fields) {
  const sql = sqlBuilder.getPage(page, limit, fields)

  return queryRunner(client, sql)
}
