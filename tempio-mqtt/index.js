'use strict'

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const aedes = require('aedes')()
const ws = require('websocket-stream')
const socketIO = require('socket.io')
const mqttServer = require('net').createServer(aedes.handle)
const db = require('tempio-db')

const app = express()
const httpServer = require('http').createServer(app)

const { auth, devices, notifications } = require('./api')
const { logger, constants, handleError } = require('./utils')

const io = socketIO(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

ws.createServer({ server: httpServer }, aedes.handle)

io.on('connection', (socket) => {
  const { clientId = '' } = socket.handshake.query

  if (clientId) {
    logger.info(`Client Connected: ${clientId}`)
    socket.join(clientId)
  }
})

app.use(cors({
  origin: '*'
}))

const config = {
  database: process.env.DB_NAME || 'tempio',
  username: process.env.DB_USER || 'koombea',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: s => logger.info(s)
}

const AgentMap = new Map()
let services, Agent, Metric, Notification

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('*', async (req, __, next) => {
  if (!services) {
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }
  }
  
  req.services = services

  next()
})

app.use('/api/auth', auth)
app.use('/api/devices', devices)
app.use('/api/notifications', notifications)

app.use(function (err, req, res, next) {
  console.warn('req', req.headers)
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'Unauthorized',
      status: 401
    })
  }
})

aedes.on('client', async (client) => {
  const clientId = client ? client.id : client

  logger.info(`Agent Connected: ${clientId}`)

  if (clientId.includes('agent:')) {
    const agentId = clientId.split(':')[1]
    const query = { agentId, status: 1 }

    try {
      const { name, status, organizationId } = await Agent.updateById(query)
      const room = `organization:${organizationId}`

      AgentMap.set(agentId, { name, status, organizationId })

      const payload = { agentId, status: 1 }

      io.to(room).emit('agent/connected', payload)
    } catch (err) {
      handleError(err)
    }
  }
})

aedes.on('clientDisconnect', async (client) => {
  const clientId = client ? client.id : client

  logger.info(`Agent Disconnected: ${clientId}`)

  if (clientId.includes('agent:')) {
    const agentId = clientId.split(':')[1]
    const query = { agentId, status: 0 }

    try { 
      const { organizationId } = await Agent.updateById(query)
      const room = `organization:${organizationId}`
      AgentMap.delete(agentId)

      const payload = { agentId, status: 0 }

      io.to(room).emit('agent/connected', payload)
    } catch (err) {
      handleError(err)
    }
  }
})

aedes.on('publish', async function (packet, client) {
  const clientId = client ? client.id : client

  switch (packet.topic) {
    case '@agent/connected':
      logger.info(`1: Agent: ${clientId} - Payload: ${packet.payload}`)
      break
    case '@agent/disconnected':
      logger.info(`2: Agent: ${clientId} - Payload: ${packet.payload}`)
      break
    case '@agent/message':
      logger.info(`Agent: ${clientId} - Payload: ${packet.payload}`)

      if (clientId.includes('agent:')) {
        try { 
          const agentId = clientId.split(':')[1]
          const payload = JSON.parse(packet.payload)
          const { organizationId } = AgentMap.get(agentId) || {}
          const data = {
            cardId: payload.id,
            temp: payload.temp,
            hostname: payload.hostname,
            organizationId
          }

          if (data.temp >= 37) {
            const notification = await Notification.create({
              cardId: payload.id,
              temp: payload.temp.toFixed(2),
              organizationId,
              agentId
            })

            const room = `organization:${organizationId}`
            io.to(room).emit('agent/notification', notification)
          }

          await Metric.create(agentId, data)
        } catch (err) {
          handleError(err)
        }
      }
      break
  }
})

httpServer.listen(3001, async () => {
  logger.info('Server listening on port: 3001')

  try {
    services = await db(config)
    Agent = services.Agent
    Metric = services.Metric
    Notification = services.Notification

    mqttServer.listen(constants.MQTT_PORT, () => {
      logger.info(`MQTT Server listening on port: ${constants.MQTT_PORT}`)
    })
  } catch (err) {
    handleError(err)
  }
})

function handleFatalError (err) {
  logger.error(err.message)
  logger.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
