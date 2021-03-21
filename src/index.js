import './config'
import colors from 'colors'
import pgBenchmark from './benchmarks/postgres'
import mongoBenchmark from './benchmarks/mongo'
import postgres from './database/postgres'
import mongo from './database/mongo'

function printStart(msg) {
  console.log(' ', colors.cyan(msg))
}

function printEnd(msg) {
  console.log(' ', colors.bgCyan(msg))
}

async function main() {
  printStart('Criando esquemas no PostgreSQL e carregando dados...')
  await postgres.loadDataset()
  printEnd('PostgreSQL carregado!')

  printStart('Criando esquemas no MongoDB e carregando dados...')
  await mongo.loadDataset()
  printEnd('MongoDB carregado!')

  printStart('Iniciando benchmark do PostgreSQL...')
  await pgBenchmark.run()
  printEnd('Benchmark do PostgreSQL finalizado!')

  printStart('Iniciando benchmark do MongoDB...')
  await mongoBenchmark.run()
  printEnd('Benchmark do MongoDB finalizado!')
}

main()
