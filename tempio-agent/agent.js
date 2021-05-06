'use strict'

require('dotenv').config()

const mqtt = require('mqtt')
const os = require('os')
const defaults = require('defaults')
const EventEmitter = require('events')

const { logger, getSerial, constants } = require('./utils')
const sensor = require('./sensor')

const host = process.env.MQTT_SERVER || 'localhost'
const port = process.env.MQTT_PORT || constants.MQTT_PORT

const options = {
  id: getSerial(),
  interval: 500,
  hostname: os.hostname(),
  mqtt: {
    host: `mqtt://${host}:${port}`
  }
}

class Agent extends EventEmitter {
  constructor (opts) {
    super()
    this._options = defaults(opts, options)
    this._started = false
    this._timer = null
    this._client = null
    this._agentId = this._options.id
  }

  connect () {
    if (!this._started) {
      const opts = this._options
      this._client = mqtt.connect(opts.mqtt.host, { clientId: this._agentId  })
      this._started = true
      
      this._client.subscribe('@agent/message')
      this._client.subscribe('@agent/connected')
      this._client.subscribe('@agent/disconnected')

      this._client.on('connect', () => {
        this.emit('connected', this._agentId)

        sensor(opts.interval, (err, data, timer) => {
          if (err) {
            logger.error(err)
            return
          }

          this._timer = timer

          const message = {
            id: this._agentId,
            timestamp: new Date().getTime(),
            hostname: opts.hostname,
            ...data
          }

          this._client.publish('@agent/message', JSON.stringify(message))

          logger.info(data)
        })
      })
    }
  }

  disconnect () {
    if (this._started) {
      clearInterval(this._timer)
      this._started = false
      // this.emit('disconnected', this._agentId)
      // this._client.end()
    }
  }
}

module.exports = Agent
