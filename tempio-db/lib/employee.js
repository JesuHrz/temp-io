'use strict'

module.exports = function setupEmployee (EmployeeModel) {
  async function findByOrganizationId (id) {
    return EmployeeModel.findAll({
      attributes: [
        'identification',
        'name',
        'lastName',
        'email',
        'born',
        'cardId',
        'updatedAt'
      ],
      where: {
        organizationId: id,
        archived: false
      },
      raw: true
    })
  }

  async function create (employee) {
    const createdEmployee = await EmployeeModel.create(employee)
    const result = createdEmployee.toJSON()

    return result
  }

  async function updateById (employee) {
    const cond = {
      where: {
        identification: employee.identification
      },
      raw: true
    }

    const existingEmployee = await EmployeeModel.findOne(cond)
    const updated = await EmployeeModel.update(employee, cond)

    return updated ? EmployeeModel.findOne(cond) : existingEmployee
  }

  async function deleteById (id) {
    const cond = {
      where: {
        identification: id
      },
      raw: true
    }
    const existingEmployee = await EmployeeModel.findOne(cond)
    const updated = await EmployeeModel.update({ archived: true }, cond)

    return updated ? EmployeeModel.findOne(cond) : existingEmployee
  }

  async function findByCardId (cardId) {
    const cond = {
      where: { cardId },
      raw: true
    }
    
    const employee = await EmployeeModel.findOne(cond)

    return employee
  }

  return {
    create,
    updateById,
    deleteById,
    findByOrganizationId,
    findByCardId
  }
}
