'use strict'

require('pg').types.setTypeParser(1114, stringValue => {
  return new Date(stringValue + '+0000')
})

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
