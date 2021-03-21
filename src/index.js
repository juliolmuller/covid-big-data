import colors from 'colors'
import pgBenchmark from './benchmarks/postgres'
import mongoBenchmark from './benchmarks/mongo'
import { loadDataset } from './database/postgres'

function printStart(msg) {
  console.log(' ', colors.cyan(msg))
}

function printEnd(msg) {
  console.log(' ', colors.bgCyan(msg))
}

async function main() {
  printStart('Criando esquemas no PostgreSQL e carregando dados...')
  await loadDataset()
  printEnd('PostgreSQL carregado!')

  printStart('Iniciando benchmark do PostgreSQL...')
  await pgBenchmark.run()
  printEnd('Benchmark do PostgreSQL finalizado!')

  printStart('Iniciando benchmark do MongoDB...')
  await mongoBenchmark.run()
  printEnd('Benchmark do MongoDB finalizado!')
}

main()
