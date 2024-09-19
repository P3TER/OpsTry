const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')

const Sede = sequelize.define('Sede', {
    id_sede: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_sede: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    departamento: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ciudad: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true
    }
}, {
    tableName: 'sede',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
})

module.exports = Sede