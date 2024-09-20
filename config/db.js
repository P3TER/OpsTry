const config = require('./config.js')
const Sequelize = require('sequelize')

const environment = 'production'
// const environment =process.env.NODE_ENV || 'desarrollo'
const {username, password, database, host, dialect} = config[environment]

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    dialectOptions: environment === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false // Permitir SSL sin verificación estricta del certificado
    }
  } : {},
})

module.exports = sequelize