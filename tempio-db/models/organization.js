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
        isUnique: async (name, done) => {
          try {
            const data = await Organization.findOne({ where: { name }})
            if (data) {
              done(new Error('Organization name is already in use'))
            }

            done()
          } catch (error) {
            done(error)
          }
        },
        notNull: {
          msg: 'The name field must not be empty',
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
          msg: 'The password field must not be empty'
        }
      },
    },
  }, {
    sequelize,
    timestamps: true,
  })

  return Organization
}
