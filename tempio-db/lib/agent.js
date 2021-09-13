'use strict'

module.exports = function setupAgent (AgentModel) {
  function create ({ name, agentId, organizationId}) {
    return AgentModel.create({
      name,
      agentId,
      organizationId,
      status: 0
    })
  }
  
  function deleteById (agentId) {
    return AgentModel.destroy({
      where: {
        agentId
      },
      raw: true
    })
  }

  async function updateById (agent) {
    const cond = {
      where: {
        agentId: agent.agentId
      },
      raw: true
    }

    const existingAgent = await AgentModel.findOne(cond)
    const updated = await AgentModel.update(agent, cond)

    return updated ? AgentModel.findOne(cond) : existingAgent
  }

  function findById (id) {
    return AgentModel.findByPk(id)
  }

  function findAll () {
    return AgentModel.findAll()
  }

  function findByStatus (status) {
    return AgentModel.findAll({
      where: {
        status
      }
    })
  }

  function findByOrganizationId (organizationId) {
    return AgentModel.findAll({
      where: {
        organizationId
      },
      raw: true
    })
  }

  return {
    create,
    deleteById,
    updateById,
    findById,
    findAll,
    findByStatus,
    findByOrganizationId
  }
}
