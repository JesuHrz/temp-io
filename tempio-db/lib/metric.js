'use strict'
const { QueryTypes, Op } = require('sequelize');
const { format } = require('date-fns')

const setupDatabase = require('./db')

module.exports = function setupMetric (MetricModel, AgentModel, config) {
  const sequelize = setupDatabase(config)

  async function findByAgentUuid (uuid) {
    return MetricModel.findAll({
      attributes: [ 'type' ],
      group: [ 'type' ],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        }
      }],
      raw: true
    })
  }

  async function findByTypeAgentUuid (type, uuid) {
    return MetricModel.findAll({
      attributes: [ 'id', 'type', 'value', 'createdAt' ],
      where: {
        type
      },
      limit: 20,
      order: [[ 'createdAt', 'DESC' ]],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        }
      }],
      raw: true
    })
  }

  async function create (agentId, metric) {
    const agent = await AgentModel.findOne({
      where: { agentId }
    })

    if (agent) {
      const data = Object.assign(metric, { agentId })
      const result = await MetricModel.create(data)
      return result.toJSON()
    }
  }

  async function findDaysByMonth (organizationId) {
    const result = await sequelize.query(queryByDaysByMonth(organizationId), {
      raw: true,
      type: QueryTypes.SELECT
    })

    return result.map(date => {
      date.low = Number.parseInt(date.low) || 0
      date.high = Number.parseInt(date.high) || 0
      return date
    })
  }

  async function findByHighAndLowTemperature (organizationId) {
    return await sequelize.query(queryByHighAndLowTemperature(organizationId), {
      raw: true,
      type: QueryTypes.SELECT
    })
  }

  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid,
    findDaysByMonth,
    findByHighAndLowTemperature
  }
}

const queryByDaysByMonth = (organizationId) => {
  const date = new Date()
  const startDay = format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd')
  const endDay = format(date, 'yyyy-MM-dd')

  return `SELECT *
    FROM  (
       SELECT day::date
       FROM   generate_series('${startDay}'::date, '${endDay}'::date, interval '1 day') day) d
    LEFT JOIN (
      SELECT
        date_trunc('day', "createdAt")::date AS day,
        COUNT(*) filter (where temp < 37) as low,
        COUNT(*) filter (where temp >= 37) as high
      FROM   "Metrics"
      WHERE  "organizationId" = ${organizationId}
      GROUP  BY 1
      ) t USING (day)
    ORDER  BY day`
}

const queryByHighAndLowTemperature = (organizationId) => {
  const date = new Date()
  const startDay = format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd')
  const endDay = format(date, 'yyyy-MM-dd')


  return `SELECT 
      COUNT(*) filter (where temp < 37) as low,
      COUNT(*) filter (where temp >= 37) as high
    FROM "Metrics"
    WHERE  "organizationId" = ${organizationId} AND "createdAt" >= '${startDay}' AND "createdAt" <= '${endDay}'`
}
