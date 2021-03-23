import './config'
import colors from 'colors'
import prompts from 'prompts'
import postgres from './database/postgres'
import mongo from './database/mongo'
import runPostgresBenchmarks from './benchmarks/postgres'
import runMongoBenchmarks from './benchmarks/mongo'

function printStart(msg) {
  console.log(' ', colors.cyan(msg))
}

function printEnd(msg) {
  console.log(' ', colors.bgCyan(msg))
}

async function configPostgres() {
  printStart('Criando esquemas no PostgreSQL e carregando dados...')
  await postgres.loadDataset()
  printEnd('PostgreSQL carregado!')
}

async function configMongo() {
  printStart('Criando esquemas no MongoDB e carregando dados...')
  await mongo.loadDataset()
  printEnd('MongoDB carregado!')
}

async function execPostgresBenchmarks() {
  printStart('Iniciando benchmark do PostgreSQL...')
  await runPostgresBenchmarks()
  printEnd('Benchmark do PostgreSQL finalizado!')
}

async function execMongoBenchmarks() {
  printStart('Iniciando benchmark do MongoDB...')
  await runMongoBenchmarks()
  printEnd('Benchmark do MongoDB finalizado!')
}

// Exibe as opções de execução do programa
async function main(defaultChoice) {
  defaultChoice !== undefined && console.log('')

  const choices = [
    { title: 'Configurar o PostgreSQL e o MongoDB' },
    { title: 'Configurar somente o PostgreSQL' },
    { title: 'Configurar somente o MongoDB' },
    { title: 'Executar benchmark no PostgreSQL' },
    { title: 'Executar benchmark no MongoDB' },
  ]
  const { option } = await prompts({
    message: 'O que deseja fazer? (tecle ESC para cancelar e sair)',
    type: 'select',
    name: 'option',
    initial: defaultChoice || 0,
    choices,
  })

  switch (option) {
    case 0:
      await configPostgres()
      await configMongo()
      main(0)
      break

    case 1:
      await configPostgres()
      main(1)
      break

    case 2:
      await configMongo()
      main(2)
      break

    case 3:
      await execPostgresBenchmarks()
      main(3)
      break

    case 4:
      await execMongoBenchmarks()
      main(4)
      break

    default:
      process.exit(0)
  }
}

main() // Chamada à execução do programa principal
