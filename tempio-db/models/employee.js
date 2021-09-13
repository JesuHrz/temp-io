'use strict'

const { DataTypes } = require('sequelize')

const setupDatabase = require('../lib/db')

module.exports = function setupEmployeeModel(config) {
  const sequelize = setupDatabase(config)

  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true
    },
    identification: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The identification field must not be empty'
        },
        isInt: {
          args: true,
          msg: 'The identification field must be number'
        }
      },
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
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The lastName field must not be empty',
        }
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'The email field must not be empty'
        },
        isEmail: {
          args: true,
          msg: 'The Invalid email'
        }
      },
    },
    born: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The born must not be empty'
        }
      }
    },
    cardId: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'The cardId field must be alphanumeric'
        }
      }
    },
    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    timestamps: true
  })

  return Employee
}
