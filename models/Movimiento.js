const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const Equipo = require('./Equipo.js')

const Movimiento = sequelize.define('Movimiento', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Equipo,
            key: 'id_equipo'
        }
    },
    tipo: {
        type: DataTypes.BOOLEAN,
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
    tableName: 'movimiento',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
})

module.exports = Movimiento