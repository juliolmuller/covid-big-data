
// Executa a query e retorna um objeto com os timestamps
async function queryRunner(query) {
  const startTimestamp = Date.now()
  const docs = await query.toArray()
  const endTimestamp = Date.now()
  const duration = endTimestamp - startTimestamp

  return {
    startTimestamp,
    endTimestamp,
    duration,
    docs,
  }
}

// Transformar { estado: cidade } em SQL para cláusula WHERE
function getPlacesClosure(places) {
  if (!places) {
    return {}
  }

  // Se for uma lista estados ['PR', 'SC', ...]
  if (places instanceof Array) {
    return {
      $or: places.map((state) => {
        return { city: '', state }
      }),
    }
  }

  // Se for um mapa de estado-cidade(s) { estado: cidade(s) }
  const closures = []

  Object.entries(places).forEach(([state, city]) => {
    if (city instanceof Array) {
      const innerClosures = city.map((c) => getPlacesClosure({ [state]: c }).$or[0])

      closures.push(...innerClosures)
    } else {
      closures.push({ city, state })
    }
  })

  return { $or: closures }
}

// Recupera a lista de estados e cidades
export function getAllPlaces(collection) {
  return queryRunner(collection.aggregate([
    { $group: { _id: { state: '$state', city: '$city' } } },
  ]))
}

// Recupera a lista de estados
export function getAllStates(collection) {
  return queryRunner(collection.aggregate([
    { $group: { _id: { state: '$state' } } },
  ]))
}

// Recupera a lista de cidades para o dado estado
export function getAllCities(collection, state) {
  return queryRunner(collection.aggregate([
    { $match: { state } },
    { $group: { _id: { state: '$state', city: '$city' } } },
  ]))
}

// Recupera todos os documentos do banco, sem filtros
export function getAll(collection, fields = {}) {
  return queryRunner(collection.find({}, fields))
}

// Recupera parte dos documentos do banco, sem filtros, por paginação
export function getPage(collection, page, limit, fields = {}) {
  return queryRunner(collection
    .find({}, fields)
    .skip(limit * (page - 1))
    .limit(limit))
}

// Recupera o(s) registro(s) para uma determinada cidade (ou cidades) em uma determinada data
export function getByDateAndPlace(collection, date, places, fields = {}) {
  return queryRunner(collection
    .find({
      ...getPlacesClosure(places),
      date: new Date(date),
    }, fields))
}

// Recupera a soma de casos e óbitos para uma determinada cidade (ou cidades) em um determinado período
export function getTotalByDateRangeAndPlace(collection, startDate, endDate, places) {
  return queryRunner(collection
    .aggregate([{
      $match: {
        ...getPlacesClosure(places),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    }, {
      $group: {
        _id: {
          city: '$city',
          state: '$state',
          city_ibge_code: '$city_ibge_code',
          estimated_population_2019: '$estimated_population_2019',
        },
        sum_confirmed: { $sum: '$new_confirmed' },
        sum_deaths: { $sum: '$new_deaths' },
      },
    }]))
}

// Recupera a média de casos e óbitos para uma determinada cidade (ou cidades) em um determinado período
export function getAverageByDateRangeAndPlace(collection, startDate, endDate, places) {
  return queryRunner(collection
    .aggregate([{
      $match: {
        ...getPlacesClosure(places),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    }, {
      $group: {
        _id: {
          city: '$city',
          state: '$state',
          city_ibge_code: '$city_ibge_code',
          estimated_population_2019: '$estimated_population_2019',
        },
        avg_confirmed: { $avg: '$new_confirmed' },
        avg_deaths: { $avg: '$new_deaths' },
      },
    }]))
}

// Recupera a média de casos e óbitos para uma determinada cidade (ou cidades) em um determinado período
export function getPercentageByDateRangeAndPlace(collection, places, date) {
  return queryRunner(collection
    .aggregate([{
      $addFields: {
        rate_confirmed: {
          $function: {
            body: 'function (cases, population) { return Math.round(cases / population * 1000) / 10 }',
            args: ['$last_available_confirmed', '$estimated_population_2019'],
            lang: 'js',
          },
        },
        rate_deaths: {
          $function: {
            body: 'function (cases, population) { return Math.round(cases / population * 1000) / 10 }',
            args: ['$last_available_deaths', '$estimated_population_2019'],
            lang: 'js',
          },
        },
      },
    }, {
      $match: {
        ...getPlacesClosure(places),
        ...(() => (date
          ? { date: new Date(date) }
          : { is_last: true }))(),
      },
    }, {
      $group: {
        _id: {
          city: '$city',
          state: '$state',
          city_ibge_code: '$city_ibge_code',
          estimated_population_2019: '$estimated_population_2019',
          total_confirmed: '$last_available_confirmed',
          total_deaths: '$last_available_deaths',
          rate_confirmed: '$rate_confirmed',
          rate_deaths: '$rate_deaths',
        },
      },
    }]))
}
