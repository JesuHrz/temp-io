'use strict'

const Sequelize = require('sequelize')
let sequelize = null

module.exports = function setupDatabase (config) {
  const { database, username, password, ...restConfig } = config

  if (!sequelize) {
    sequelize = new Sequelize(database, username, password, {
      define: {
        charset: 'utf8',
        dialectOptions: {
          collate: 'utf8_general_ci'
        }
      },
      ...restConfig,
    })
  }
  return sequelize
}
