'use strict'

const aedes = require('aedes')()
const httpServer = require('net').createServer(aedes.handle)

const { logger, constants } = require('./utils')

aedes.on('client', function (client) {
  const clientId = client ? client.id : client
  const aedesId = aedes.id

  logger.info(`Client Connected: ${clientId} - Aedes (Broker): ${aedesId}`)
})

aedes.on('clientDisconnect', function (client) {
  const clientId = client ? client.id : client
  const aedesId = aedes.id
  logger.info(`Client Disconnected: ${clientId} - Aedes (Broker): ${aedesId}`)
})

aedes.on('publish', async function (packet, client) {
  const clientId = client ? client.id : client
  const aedesId = aedes.id
  const { payload, topic } = packet
  logger.info(`Client publish: ${clientId} - Aedes (Broker): ${aedesId}`)
  logger.info(`Topic: ${topic} - Payload: ${payload.toString()}`)
})

httpServer.listen(constants.MQTT_PORT, function () {
  logger.info(`MQTT Server listening on port: ${constants.MQTT_PORT}`)
  // aedes.publish({ topic: 'aedes/hello', payload: "I'm broker " + aedes.id })
})

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
