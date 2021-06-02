'use strict'

const { DataTypes, Deferrable } = require('sequelize')

const setupDatabase = require('../lib/db')

module.exports = function setupMetricModel(config) {
  const sequelize = setupDatabase(config)

  const { Employee } = sequelize.models

  const Metric = sequelize.define('Metric', {
    hostname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The hostname field must not be empty'
        }
      },
    },
    temp: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The temp field must not be empty'
        },
        isDecimal: {
          args: true,
          msg: 'The temp field must be decimal'
        }
      },
    },
    cardId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: Employee,
        key: 'cardId',
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'The cardId field must be alphanumeric'
        }
      }
    },
  }, {
    sequelize,
    timestamps: true
  })

  return Metric
}
