    const sequelize = require('sequelize')
    const Sede = require('../models/Sede.js')

    exports.createSede = async (req, res) => {
        try {
            const { nombre_sede, departamento, ciudad } = req.body

            if (!nombre_sede || !departamento || !ciudad) {
                return res.status(400).send({ message: 'Falta información' })
            }
            const nuevaSede = await Sede.create({ nombre_sede, departamento, ciudad })
            res.status(201).json({ message: `Sede creada éxitosamente`, sede: nuevaSede })
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: 'Error al crear la sede' })
        }
    }

    exports.getSede = async (req, res) => {
        try {
            const { id_sede } = req.params
            const sede = await Sede.findByPk(id_sede)
            if (!sede) {
                return res.status(404).send({ message: 'Sede no encontrada' })
            }
            res.json(sede)
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: 'Error al obtener la sede' })
        }
    }

    exports.getSedes = async (req, res) => {
        try {
            const sedes = await Sede.findAll();
            if (!sedes) {
                return res.status(404).send({ message: 'No hay sedes' })
            }
            res.json(sedes);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener las sedes' });
        }
    }

    exports.updateSede = async (req, res) => {
        try {
            const { id_sede } = req.params
            const { nombre_sede, departamento, ciudad } = req.body

            const actualizar = await Sede.update({ nombre_sede, departamento, ciudad }, { where: { id_sede } })
            if (!actualizar) {
                return res.status(404).send({ message: 'Sede no encontrada' })
            }
            res.json({ message: `Sede actualizada éxitosamente` })
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: 'Error al actualizar la sede' })
        }
    }

    exports.deleteSede = async (req, res) => {
        try {
            const { id_sede } = req.params

            await Sede.destroy({ where: { id_sede } })
            res.json({ message: `Sede eliminada éxitosamente` })
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: 'Error al eliminar la sede' })
        }
    }