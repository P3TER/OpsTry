const { DataTypes } = require('sequelize');
const sequelize = require('./config/db.js');

const Session = sequelize.define('Session', {
    sid: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        unique: true
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },fecha_creacion: {
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
    tableName: 'sessions',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
});

module.exports = Session;
