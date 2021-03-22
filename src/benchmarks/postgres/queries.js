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

// Recupera a lista de cidades para o dado estado
export function getAllCities(client, state) {
  const sql = sqlBuilder.getAllCities(state)

  return queryRunner(client, sql)
}

// Recupera todos os registros do banco, sem filtros
export function getAll(client, fields) {
  const sql = sqlBuilder.getAll(fields)

  return queryRunner(client, sql)
}

// Recupera parte dos registros do banco, sem filtros, por paginação
export function getPage(client, page, limit, fields) {
  const sql = sqlBuilder.getPage(page, limit, fields)

  return queryRunner(client, sql)
}

// Recupera o(s) registro(s) para uma determinada cidade (ou cidades) em uma determinada data
export function getByDateAndPlace(client, date, places, fields = '*') {
  const sql = sqlBuilder.getByDateAndPlace(fields, date, places)

  return queryRunner(client, sql)
}

// Recupera a soma de casos e óbitos para uma determinada cidade (ou cidades) em um determinado período
export function getTotalByDateRangeAndPlace(client, startDate, endDate, places) {
  const sql = sqlBuilder.getByDateRangeAndPlace('SUM', startDate, endDate, places)

  return queryRunner(client, sql)
}

// Recupera a média de casos e óbitos para uma determinada cidade (ou cidades) em um determinado período
export function getAverageByDateRangeAndPlace(client, startDate, endDate, places) {
  const sql = sqlBuilder.getByDateRangeAndPlace('AVG', startDate, endDate, places)

  return queryRunner(client, sql)
}

// Recupera a média de casos e óbitos para uma determinada cidade (ou cidades) em um determinado período
export function getPercentageByDateRangeAndPlace(client, places, date) {
  const sql = sqlBuilder.getPercentageByDateRangeAndPlace(places, date)

  return queryRunner(client, sql)
}
