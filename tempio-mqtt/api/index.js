'use strict'

require('dotenv').config()

const auth = require('./auth')
const devices = require('./devices')
const notifications = require('./notifications')

module.exports = {
  auth,
  devices,
  notifications
}
