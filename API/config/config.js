const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    desarrollo: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: true
    },
    production: {
        username: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_NAME,
        host: process.env.PG_HOST,
        dialect: 'postgres',
        logging: false
    }
}
