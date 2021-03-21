import pgBenchmark from './benchmarks/postgres'
import mongoBenchmark from './benchmarks/mongo'

async function main() {
  console.log('Iniciando benchmark do PostgreSQL...')
  await pgBenchmark.run()
  console.log('Benchmark do PostgreSQL finalizado! \n')

  console.log('Iniciando benchmark do MongoDB...')
  await mongoBenchmark.run()
  console.log('Benchmark do MongoDB finalizado! \n')
}

main()
