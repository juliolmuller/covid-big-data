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

async function runModules() {
  const { option } = await prompts({
    message: 'O que deseja fazer?',
    type: 'select',
    name: 'option',
    initial: 0,
    choices: [
      { title: 'Configurar o PostgreSQL e o MongoDB' },
      { title: 'Configurar somente o PostgreSQL' },
      { title: 'Configurar somente o MongoDB' },
      { title: 'Executar benchmark no PostgreSQL' },
      { title: 'Executar benchmark no MongoDB' },
      { title: 'Cancelar e sair' },
    ],
  })

  switch (option) {
    case 0:
      await configPostgres()
      await configMongo()
      break

    case 1:
      await configPostgres()
      break

    case 2:
      await configMongo()
      break

    case 3:
      await execPostgresBenchmarks()
      break

    case 4:
      await execMongoBenchmarks()
      break

    default:
      process.exit(0)
  }

}

runModules()
