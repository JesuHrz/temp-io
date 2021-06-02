'use strict'

const { DataTypes } = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = function setupAgentModel(config) {
  const sequelize = setupDatabase(config)

  const Agent = sequelize.define('Agent', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The name field must not be empty',
        }
      },
    },
    agentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The agentId field must not be empty',
        },
        isAlphanumeric: {
          args: true,
          msg: 'The agentId field must be alphanumeric',
        }
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      isIn: [[0, 1]], 
      validate: {
        notNull: {
          msg: 'The status field must not be empty',
        },
        isInt: {
          args: true,
          msg: 'The status field must be 0 or 1',
        }
      },
    },
  }, {
    sequelize,
    timestamps: true
  })

  return Agent
}
