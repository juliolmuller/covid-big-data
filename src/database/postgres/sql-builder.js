
const TABLE_NAME = 'covid_cases'

// Transformar { estado: cidade } em SQL para cláusula WHERE
function getPlacesClosure(places) {
  if (!places) {
    return ''
  }

  // Se for uma lista estados ['PR', 'SC', ...]
  if (places instanceof Array) {
    return places.map((state) => {
      return `(state = '${state}' AND city IS NULL)`
    }).join(' OR ')
  }

  // Se for um mapa de estado-cidade(s) { estado: cidade(s) }
  const closures = []

  Object.entries(places).forEach(([state, city]) => {
    if (city instanceof Array) {
      const innerClosures = city.map((c) => getPlacesClosure({ [state]: c }))

      closures.push(innerClosures.join(' OR '))
    } else {
      closures.push(`(state = '${state}' AND city = '${city}')`)
    }
  })

  return closures.join(' OR ')
}

// Retorna a lista de todas as cidades com seus respectivos estados
export function getAllPlaces() {
  return `
    SELECT DISTINCT
        state, city
      FROM ${TABLE_NAME}
      WHERE
        state IS NOT NULL
      ORDER BY
        state, city
  `
}

// Retorna a lista de todos os estados somente
export function getAllStates() {
  return `
    SELECT DISTINCT
        state
      FROM ${TABLE_NAME}
      ORDER BY
      state
  `
}

// Retorna a lista de todas as cidades com seus respectivos estados
export function getAllCities(state) {
  return `
    SELECT DISTINCT
        city
      FROM ${TABLE_NAME}
      WHERE
        state = '${state}'
      ORDER BY
        city
  `
}

// Recuperar todos os registros
export function getAll(fields = '*') {
  return `
    SELECT
        ${fields}
      FROM ${TABLE_NAME}
      ORDER BY
        date, state, city
  `
}

// Recuperar registros paginados
export function getPage(page, limit, fields = '*') {
  return `
    SELECT
        ${fields}
      FROM ${TABLE_NAME}
      ORDER BY
        date, state, city
      LIMIT ${limit}
      OFFSET ${limit * (page - 1)}
  `
}

// Total absoluto de infectados em uma data e lugar (estado e cidade)
export function getByDateAndPlace(fields, date, places) {
  const placeFilter = getPlacesClosure(places)
  const closure = placeFilter
    ? `(${placeFilter}) AND '${date}'`
    : `'${date}'`

  return `
    SELECT
        ${fields}
      FROM ${TABLE_NAME}
      WHERE
        ${closure}
      ORDER BY
        date
  `
}

// Total de casos em um período
export function getByDateRangeAndPlace(fields, startDate, endDate, places) {
  const placeFilter = getPlacesClosure(places)
  const dateFilter = `date BETWEEN '${startDate}' AND '${endDate}'`
  const closure = placeFilter
    ? `(${placeFilter}) AND '${dateFilter}'`
    : `'${dateFilter}'`

  return `
    SELECT
        ${fields}
      FROM ${TABLE_NAME}
      WHERE
        ${closure}
      GROUP BY
        city
      ORDER BY
        city, date
  `
}

// Total de casos em um período
export function getByPlaceGrouping(fields, places, group) {
  const placeFilter = getPlacesClosure(places)
  const where = placeFilter ? `WHERE ${placeFilter}` : ''
  const groupBy = `GROUP BY ${group}`

  return `
    SELECT
        ${fields}
      FROM ${TABLE_NAME}
      ${where}
      ${groupBy}
      ORDER BY
        date, state, city
  `
}
