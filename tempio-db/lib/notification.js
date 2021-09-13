'use strict'

module.exports = function setupNotification (NotificationModel, EmployeeModel) {
  async function create (data = {}) {
    const {
      agentId = '',
      cardId = '',
      organizationId = '',
      temp = ''
    } = data

    const { identification: employeeId } = await EmployeeModel.findOne({
      where: { cardId }
    })

    if (employeeId && agentId && organizationId && temp) {
      const nofiticationData = {
        temp,
        employeeId,
        organizationId,
        agentId
      }

      const description = `El empleado con el # de identificacion ${employeeId} registro una temperatura de ${temp}°C`

      const result = await NotificationModel.create({
        ...nofiticationData,
        description
      })

      return result.toJSON()
    }
  }

  async function findByOrganizationId (organizationId) {
    return NotificationModel.findAll({
      attributes: ['id', 'agentId', 'employeeId', 'description' ,'createdAt'],
      where: { organizationId },
      limit: 50,
      order: [[ 'createdAt', 'DESC' ]],
      raw: true
    })
  }

  async function readAll (organizationId) {
    return NotificationModel.update(
      { read: 1 },
      {
        where : { organizationId }
      }
    )
  }

  return {
    create,
    findByOrganizationId,
    readAll
    // findByAgentId,
    // findByEmployeeId,
  }
}
