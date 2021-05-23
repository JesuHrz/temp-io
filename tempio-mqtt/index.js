'use strict'

const express = require('express')
const aedes = require('aedes')()
const ws = require('websocket-stream')
const MQTTServer = require('net').createServer(aedes.handle)

const app = express()
const HTTPServer = require('http').createServer(app)

ws.createServer({ server: HTTPServer }, aedes.handle)

const { logger, constants } = require('./utils')

aedes.on('client', function (client) {
  const clientId = client ? client.id : client
  logger.info(`Client Connected: ${clientId}`)
})

aedes.on('clientDisconnect', function (client) {
  const clientId = client ? client.id : client
  logger.info(`Client Disconnected: ${clientId}`)
})

aedes.on('publish', async function (packet, client) {
  const clientId = client ? client.id : client

  switch (packet.topic) {
    case '@agent/connected':
    case '@agent/disconnected':
      logger.info(`Client: ${clientId} - Payload: ${packet.payload}`)
      break
    case '@agent/message':
      logger.info(`Client: ${clientId} - Payload: ${packet.payload}`)
      break
  }
})

MQTTServer.listen(constants.MQTT_PORT, function () {
  logger.info(`MQTT Server listening on port: ${constants.MQTT_PORT}`)
})

HTTPServer.listen(3000, function() {
  logger.info('Server listening on port: 3000')
});

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
