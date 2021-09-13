const { logger } = require('../utils')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'tempio',
    username: process.env.DB_USER || 'koombea',
    password: process.env.DB_PASS || '',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => logger.info(s)
  },
  auth: {
    secret: process.env.JWT_SECRET || 'platzi',
    algorithms: ['HS256']
  }
}