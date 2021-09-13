'use strict'

const setupOrganizationModel = require('./organization')
const setupEmployeeModel = require('./employee')
const setupAgentModel = require('./agent')
const setupMetricModel = require('./metric')
const setupNotificationModel = require('./notification')

module.exports = {
  setupOrganizationModel,
  setupEmployeeModel,
  setupAgentModel,
  setupMetricModel,
  setupNotificationModel
}