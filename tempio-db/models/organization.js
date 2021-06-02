'use strict'

const { DataTypes } = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = function setupOrganizationModel(config) {
  const sequelize = setupDatabase(config)

  const Organization = sequelize.define('Organization', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'This field must not be empty',
        }
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid Email'
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'This field must not be empty'
        }
      },
    },
  }, {
    sequelize,
    timestamps: true,
  })

  return Organization
}
