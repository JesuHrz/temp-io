'use strict'

const express = require('express')
const auth = require('express-jwt')

const config = require('./config')
const { handleError } = require('../utils')

const notifications = express.Router()

notifications.get('/', auth(config.auth), async (req, res) => {
  try {
    const { Notification } = req.services
    const { id } = req.user

    const notifications = await Notification.findByOrganizationId(id)

    res.status(200).json({
      notifications
    })
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

notifications.post('/read', auth(config.auth), async (req, res) => {
  try {
    const { Notification } = req.services
    const { id } = req.user

    const notifications = await Notification.readAll(id)

    res.status(201).json({
      notifications
    })
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

module.exports = notifications