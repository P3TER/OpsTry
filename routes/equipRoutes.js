const express = require("express")
const { verifySession, isVigilante } = require("../middleware/authMiddleware.js")
const { createEquipo, getEquipo, updateEquipo, ingresoYSalida, getMovimientos, getEquipos, miEquipo } = require("../controllers/equipmentController.js")

const router = express.Router()

router.post('/registrarEquipo', verifySession, createEquipo)
router.get('/movimientos', verifySession, isVigilante, getMovimientos)
router.get('/:codigoBarras', verifySession, getEquipo)
router.put('/:codigoBarras', verifySession, isVigilante, updateEquipo)
router.post('/:codigoBarras/mark', verifySession, isVigilante, ingresoYSalida)
router.get('/', verifySession, getEquipos)
router.get('/miEquipo/:id_usuario', verifySession, miEquipo)

module.exports = router