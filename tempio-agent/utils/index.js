'use strict'

const { execSync } = require('child_process')
const { networkInterfaces } = require('os')
const pino = require('pino')

const constants = require('./constants')

const logger = pino()

function getSerial () {
  try {
    const cmd = 'cat /proc/cpuinfo | grep Serial | cut -d " " -f 2'
    const result = execSync(cmd)
    const serial = result.toString().trim()

    return serial
  } catch (err) {
    const error = err.stderr.toString()
    logger.error(`Error when getting the Rapsberry Serial: ${error}`)
    process.exit(1)
  }
}

function getIP () {
  const nets = networkInterfaces()
  const [net] = nets.wlan0

  return net.address
}

module.exports = {
  logger,
  constants,
  getSerial
}