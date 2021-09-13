'use strict'

const { DataTypes, Deferrable } = require('sequelize')

const setupDatabase = require('../lib/db')

module.exports = function setupNotificationModel(config) {
  const sequelize = setupDatabase(config)

  const { Employee, Agent, Organization } = sequelize.models

  const Notification = sequelize.define('Notification', {
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Organization,
        key: 'id',
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
      validate: {
        notNull: {
          msg: 'The organizationId field must not be empty',
        },
        isInt: {
          args: true,
          msg: 'The organizationId field must be number'
        }
      },
    },
    agentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Agent,
        key: 'agentId',
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
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
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: 'identification',
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
      validate: {
        isInt: {
          args: true,
          msg: 'The identification field must be number'
        }
      }
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
    read: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The description field must not be empty'
        }
      },
    }
  }, {
    sequelize,
    timestamps: true
  })

  return Notification
}
