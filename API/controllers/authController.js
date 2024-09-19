const bcrypt = require('bcrypt');
const axios = require('axios');
const Usuario = require('../models/Usuario.js');
const Sede = require('../models/Sede.js');
const Joi = require('joi');

const usuarioSchema = Joi.object().keys({
    tipo_documento: Joi.string().valid('CC', 'TI', 'CE', 'OT').required(),
    numero_documento: Joi.string().required(),
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    sede_id: Joi.number().integer().required(),
    telefono: Joi.string().required(),
    contra: Joi.string().optional(),
    rol: Joi.string().valid('SuperAdmin', 'Usuario', 'Vigilante', 'Director').required()
});

exports.registerUsuario = async (req, res) => {
    try {
        const { tipo_documento, numero_documento, nombre, apellido, sede_id, telefono, contra, rol, novedad } = req.body;

        if (!tipo_documento || !numero_documento || !nombre || !apellido || !sede_id || !telefono || !contra || !rol) {
            return res.status(400).send('Todos los campos son requeridos');
        }

        const { error } = usuarioSchema.validate(req.body);
        if (error) {
            return res.status(400).send(`Error de validación: ${error.details[0].message}`);
        }

        const contraEncriptada = await bcrypt.hash(contra, 10);

        await Usuario.create({
            tipo_documento,
            numero_documento,
            nombre,
            apellido,
            sede_id,
            telefono,
            contra: contraEncriptada,
            rol,
            novedad: (novedad || 'Creado por un director')
        });

        res.status(201).send('Usuario registrado correctamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar el usuario');
    }
};

exports.updateUsuario = async (req, res) => {
    try {
        const { nombre, apellido, numero_documento, tipo_documento, telefono, sede_id, novedad } = req.body;
        const userId = req.params.numero_documento; // O cambiar a 'id_usuario' según sea necesario

        const usuario = await Usuario.findOne({ where: { numero_documento: userId } });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.update({
            nombre,
            apellido,
            numero_documento,
            tipo_documento,
            telefono,
            sede_id,
            novedad
        });

        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};


exports.getSessionStatus = async (req, res) => {
    try {
        if (req.session.usuario) {
            res.json({
                isAuthenticated: true,
                userRole: req.session.usuario.rol,
            });
        } else {
            res.status(401).json({
                isAuthenticated: false,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el estado de la sesión' });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { numero_documento, contra } = req.body;

        const { error } = Joi.object().keys({
            numero_documento: Joi.string().required(),
            contra: Joi.string().required()
        }).validate(req.body);
        if (error) {
            return res.status(400).send(`Error de validación: ${error.details[0].message}`);
        }

        const usuario = await Usuario.findOne({ where: { numero_documento } });

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        const validacion = await bcrypt.compare(contra, usuario.contra);

        if (!validacion) {
            return res.status(401).send('Contraseña incorrecta');
        }

        // Almacenar información relevante en la sesión
        req.session.usuario = {
            id_usuario: usuario.id_usuario,
            rol: usuario.rol,
            nombre: usuario.nombre,
            sede_id: usuario.sede_id
        };

        res.json({
            message: 'Sesión iniciada correctamente',
            usuario: req.session.usuario
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al iniciar sesión');
    }
};

exports.checkSession = async (req, res) => {
    try {
        if (req.session && req.session.usuario) {
            res.status(200).json({ loggedIn: true, user: req.session.usuario });
        } else {
            res.status(200).json({ loggedIn: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al chequear sesión');
    }
};

exports.logOut = async (req, res) => {
    // Destruir la sesión
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Error al cerrar sesión');
            }
            res.status(200).send({ message: 'Sesión cerrada exitosamente' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cerrar sesión');
    }
};

// Obtener perfil de usuario
exports.perfil = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const perfil = await Usuario.findByPk(id_usuario);
        if (!perfil) {
            return res.status(404).send('No hay perfil');
        }
        res.json(perfil);
    } catch (err) {
        console.error(err);
        res.status(500).send('Fallo al obtener perfil');
    }
};

// Obtener usuarios
// Obtener usuarios
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            include: [{ model: Sede, attributes: ['nombre_sede'] }] // Asegúrate de que el atributo sea correcto
        });
        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ error: 'No hay usuarios' });
        }
        res.json(usuarios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

// Obtener usuarios por rol
exports.getUsuariosByRol = async (req, res) => {
    try {
        const { rol } = req.query;
        let rolesValidos = ['SuperAdmin', 'Director', 'Vigilante', 'Usuario']; // Asegúrate de incluir todos los roles posibles

        if (!rolesValidos.includes(rol)) {
            return res.status(400).json({ message: 'Rol no válido' });
        }

        const result = await Usuario.findAll({ where: { rol: rol } });

        if (!result || result.length === 0) {
            return res.status(404).json({ error: `No hay usuarios con rol ${rol}` });
        }

        res.json(result);
    } catch (error) {
        console.error('Error fetching users by role:', error);
        res.status(500).json({ message: 'Error fetching users by role' });
    }
};


// Obtener departamentos y ciudades de Colombia
exports.getDepartamentosCiudades = async (req, res) => {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json');
        const departamentos = response.data.map((item) => ({
            departamento: item.departamento,
            ciudades: item.ciudades,
        }));
        res.json(departamentos);
    } catch (error) {
        console.error('Error al obtener departamentos y ciudades:', error);
        res.status(500).send('Error al obtener los departamentos y ciudades');
    }
};

// Refrescar sesión
exports.refreshSession = async (req, res) => {
    try {
        const usuario = req.session.usuario;
        if (!usuario) {
            return res.status(401).json({ error: "Acceso denegado, no se proporcionó una sesión válida" });
        }
        // Actualiza la sesión del usuario
        req.session.usuario = usuario;
        res.json({ message: 'Sesión actualizada', usuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la sesión' });
    }
};