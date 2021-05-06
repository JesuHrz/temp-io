'use strict'

const pino = require('pino')

const logger = pino({
  prettyPrint: {
    translateTime: 'SYS:standard',
  },
})

module.exports = {
  logger
}