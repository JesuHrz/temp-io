'use strict'

const Agent = require('./agent')

const { logger } = require('./utils')

async function init () {
  try {
    const agent = new Agent()

    agent.connect()
  } catch (err) {
    handleError(err)
  }
}

init()

function handleFatalError (err) {
  logger.error(err.message)
  logger.error(err.stack)
  process.exit(1)
}

function handleError (err) {
  logger.error(err.message)
  logger.error(err.stack)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
