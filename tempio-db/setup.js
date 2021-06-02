'use strict'

const db = require('./')
const { logger } = require('./utils')

async function setup () {
  
  const config = {
    database: process.env.DB_NAME || 'tempio',
    username: process.env.DB_USER || 'koombea',
    password: process.env.DB_PASS || '',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => logger.info(s),
    setup: true
  }

  await db(config).catch(handleFatalError)
  process.exit(0)
}

function handleFatalError (err) {
  logger.error(err.message)
  logger.error(err.stack)
  process.exit(1)
}

setup()
