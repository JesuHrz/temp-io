'use strict'

module.exports = function setupOrganization (OrganizationModel) {
  async function create (data) {
    const createdOrganization = await OrganizationModel.create(data)
    const result = createdOrganization.toJSON()

    delete result.password

    return result
  }

  async function findByEmailAndPassword (data) {
    const oganization = await OrganizationModel.findOne({
      where: data
    })
    let result = null

    if (oganization) {
      result = oganization.toJSON() || {}
      delete result.password
    }

    return result
  }

  return {
    create,
    findByEmailAndPassword
  }
}
