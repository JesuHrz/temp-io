'use strict'

const pino = require('pino')

const constants = require('./constants')
const { generateToken, verifyToken } = require('./jwt')

const logger = pino({
  prettyPrint: {
    translateTime: 'SYS:standard',
  },
})

function handleError (err) {
  logger.error(err.message)
  logger.error(err.stack)
}

module.exports = {
  logger,
  constants,
  generateToken,
  verifyToken,
  handleError
}