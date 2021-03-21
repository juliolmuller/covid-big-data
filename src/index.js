import colors from 'colors'
import pgBenchmark from './benchmarks/postgres'
import mongoBenchmark from './benchmarks/mongo'

function printStart(msg) {
  console.log(' ', colors.cyan(msg))
}

function printEnd(msg) {
  console.log(' ', colors.bgCyan(msg))
}

async function main() {
  printStart('Iniciando benchmark do PostgreSQL...')
  await pgBenchmark.run()
  printEnd('Benchmark do PostgreSQL finalizado!')

  printStart('Iniciando benchmark do MongoDB...')
  await mongoBenchmark.run()
  printEnd('Benchmark do MongoDB finalizado!')
}

main()
