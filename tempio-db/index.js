'use strict'

const defaults = require('defaults')

const setupDatabase = require('./lib/db')

const {
  setupOrganizationModel,
  setupEmployeeModel,
  setupAgentModel,
  setupMetricModel,
  setupNotificationModel
} = require('./models')

const setupAgent = require('./lib/agent')
const setupMetric = require('./lib/metric')
const setupOrganization = require('./lib/organization')
const setupNotification = require('./lib/notification')
const setupEmployee = require('./lib/employee')

module.exports = async function (config) {
  config = defaults(config, {})

  const sequelize = setupDatabase(config)

  const OrganizationModel = setupOrganizationModel(config)
  const EmployeeModel = setupEmployeeModel(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)
  const NotificationModel = setupNotificationModel(config)

  const Agent = setupAgent(AgentModel)
  const Metric = setupMetric(MetricModel, AgentModel, config)
  const Organization = setupOrganization(OrganizationModel)
  const Notification = setupNotification(NotificationModel, EmployeeModel)
  const Employee = setupEmployee(EmployeeModel)

  // A Organization has many Employees
  OrganizationModel.hasMany(EmployeeModel, { foreignKey: 'organizationId' })
  EmployeeModel.belongsTo(OrganizationModel, { foreignKey: 'organizationId' })

  // A Organization has many Agents
  OrganizationModel.hasMany(AgentModel, { foreignKey: 'organizationId' })
  AgentModel.belongsTo(OrganizationModel, { foreignKey: 'organizationId' })

  // A Organization has many Metrics
  OrganizationModel.hasMany(MetricModel, { foreignKey: 'organizationId' })
  MetricModel.belongsTo(OrganizationModel, { foreignKey: 'organizationId' })

  // A Organization has many Notifications
  OrganizationModel.hasMany(NotificationModel, { foreignKey: 'organizationId' })
  NotificationModel.belongsTo(OrganizationModel, { foreignKey: 'organizationId' })

  // A Employee has many Metrics
  EmployeeModel.hasMany(MetricModel, { foreignKey: 'cardId' })
  MetricModel.belongsTo(EmployeeModel, { foreignKey: 'cardId' })

  // A Employee has many Notifications
  EmployeeModel.hasMany(NotificationModel, { foreignKey: 'employeeId' })
  NotificationModel.belongsTo(EmployeeModel, { foreignKey: 'employeeId' })

  // A Agent has many Metrics
  AgentModel.hasMany(MetricModel, { foreignKey: 'agentId' })
  MetricModel.belongsTo(AgentModel, { foreignKey: 'agentId' })

  // A Agent has many Notifications
  AgentModel.hasMany(NotificationModel, { foreignKey: 'agentId' })
  NotificationModel.belongsTo(AgentModel, { foreignKey: 'agentId' })

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })

    const dataOrganization = await OrganizationModel.create({
      name: 'TempIO',
      email: 'tempio@gmail.com',
      password: 'qwerty'
    })

    await EmployeeModel.create({
      identification: 1045739651,
      name: 'Jesus',
      lastName: 'Hernandez',
      email: 'jesusbeckan@gmail.com',
      born: '20/06/96',
      cardId: 'BEBF5A31',
      organizationId: dataOrganization.id
    })
  
    await AgentModel.create({
      name: 'Main Agent',
      agentId: '000000008b81e5b3',
      status: 0,
      organizationId: dataOrganization.id
    })
  }

  return {
    Organization,
    Agent,
    Metric,
    Notification,
    Employee
  }
}
