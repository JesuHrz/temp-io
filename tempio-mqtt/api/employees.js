'use strict'

const express = require('express')
const auth = require('express-jwt')

const config = require('./config')
const { handleError } = require('../utils')

const devices = express.Router()

devices.get('/', auth(config.auth), async (req, res) => {
  try {
    const { Employee } = req.services
    const { id } = req.user
    const employees = await Employee.findByOrganizationId(id)

    res.status(200).json({
      id: id,
      employees
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
    const { Employee } = req.services
    const { id } = req.user
    const employee = await Employee.create({ ...req.body, organizationId: id })
    res.status(201).json({ employee })
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

devices.put('/', auth(config.auth), async (req, res) => {
  try {
    const data = req.body
    const { Employee } = req.services
    const employee = await Employee.updateById(data)

    res.status(200).json({ employee })
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

devices.delete('/', auth(config.auth), async (req, res) => {
  try {
    const { id } = req.body
    const { Employee } = req.services
    await Employee.deleteById(id)

    res.status(204).json({})
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

module.exports = devices