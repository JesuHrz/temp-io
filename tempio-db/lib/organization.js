'use strict'

module.exports = function setupOrganization (OrganizationModel) {
  async function create (data) {
    const createdOrganization = await OrganizationModel.create(data)
    const result = createdOrganization.toJSON()

    delete result.password

    return result
  }

  return {
    create
  }
}
