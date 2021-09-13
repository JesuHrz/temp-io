'use strict'

require('dotenv').config()

const auth = require('./auth')
const devices = require('./devices')
const notifications = require('./notifications')
const employees = require('./employees')
const metrics = require('./metrics')

module.exports = {
  auth,
  devices,
  notifications,
  employees,
  metrics
}
