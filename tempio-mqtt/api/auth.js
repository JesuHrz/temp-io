'use strict'

require('dotenv').config()

const express = require('express')

const { generateToken, handleError } = require('../utils')

const auth = express.Router()

auth.post('/', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res
      .status(400)
      .json({ error: 'Email or password invalid' })
    return
  }

  try {
    const { Organization } = req.services
    const data = await Organization.findByEmailAndPassword({ email, password })
    const token = generateToken({ ...data })

    if (!data) {
      res.status(401).json({ error: 'Email or password invalid' })
      return
    }

    res.status(201).json({...data, token})
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

auth.post('/sign-up', async (req, res) => {
  const { organization, email, password } = req.body

  if (!organization || !email || !password) {
    res
      .status(400)
      .json({ error: 'Missing params' })
    return
  }

  try {
    const { Organization } = req.services
    const data = await Organization.create({ name: organization, email, password })
    const token = generateToken(data)

    res.status(201).json({...data, token})
  } catch (err) {
    handleError(err)
    res.
      status(400)
      .json({ error: err.message })
  }
})

module.exports = auth