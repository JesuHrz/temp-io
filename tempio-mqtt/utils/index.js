'use strict'

const pino = require('pino')
const constants = require('./constants')

const logger = pino({
  prettyPrint: {
    translateTime: 'SYS:standard',
  },
})

module.exports = {
  logger,
  constants
}