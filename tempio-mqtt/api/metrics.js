'use strict'

const express = require('express')
const auth = require('express-jwt')

const config = require('./config')
const { handleError } = require('../utils')

const devices = express.Router()

devices.get('/', auth(config.auth), async (req, res) => {
  try {
    const { Metric } = req.services
    const { id } = req.user

    const line = await Metric.findDaysByMonth(id)
    const pie = await Metric.findByHighAndLowTemperature(id)

    res.status(200).json({
      pie: pie[0] || {},
      line
    })
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

module.exports = devices