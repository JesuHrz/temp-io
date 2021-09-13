'use strict'

const express = require('express')
const auth = require('express-jwt')

const config = require('./config')
const { handleError } = require('../utils')

const devices = express.Router()

devices.get('/', auth(config.auth), async (req, res) => {
  try {
    const { Agent } = req.services
    const { id } = req.user
    const agents = await Agent.findByOrganizationId(id)

    res.status(200).json({
      id: id,
      devices: agents
    })
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

devices.post('/', auth(config.auth), async (req, res) => {
  try {
    const { agentId, name } = req.body
    const { Agent } = req.services
    const { id } = req.user
    const agent = await Agent.create({ name, agentId, organizationId: id })
    res.status(201).json({ agent })
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

devices.put('/', auth(config.auth), async (req, res) => {
  try {
    const { Agent } = req.services
    const agent = await Agent.updateById(req.body)

    res.status(200).json({ agent })
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

devices.delete('/', auth(config.auth), async (req, res) => {
  try {
    const { agentId } = req.body
    const { Agent } = req.services
    await Agent.deleteById(agentId)

    res.status(204).json({})
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

module.exports = devices