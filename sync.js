const sequelize = require('./config/db');

// Importar modelos
const Sede = require('./models/Sede');
const Usuario = require('./models/Usuario');
const Equipo = require('./models/Equipo');
const Movimiento = require('./models/Movimiento');

// Sincronizar modelos
const syncModels = async () => {
    try {
        // Sincronizar modelos en orden
        await Sede.sync({ force: true }); // Crea la tabla Sede
        await Usuario.sync({ force: true }); // Crea la tabla Usuario
        await Equipo.sync({ force: true }); // Crea la tabla Equipo
        await Movimiento.sync({ force: true }); // Crea la tabla Movimiento
        
        console.log('Las tablas se sincronizaron correctamente.');
    } catch (error) {
        console.error('Error al sincronizar las tablas:', error);
    }
};

// syncModels();
