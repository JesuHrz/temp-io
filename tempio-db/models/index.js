'use strict'

const setupOrganizationModel = require('./organization')
const setupEmployeeModel = require('./employee')
const setupAgentModel = require('./agent')
const setupMetricModel = require('./metric')

module.exports = {
  setupOrganizationModel,
  setupEmployeeModel,
  setupAgentModel,
  setupMetricModel
}