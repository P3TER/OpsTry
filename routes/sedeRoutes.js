const express = require('express');
const { createSede, getSede, updateSede, deleteSede, getSedes } = require('../controllers/sedeController.js')
const { verifySession, isSuperAdmin } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.use(verifySession);

router.get('/', getSedes);
router.post('/crear', isSuperAdmin, createSede);
router.get('/sede/:id_sede', getSede);
router.put('/actualizar/:id_sede', isSuperAdmin, updateSede);
router.delete('/borrar/:id_sede', isSuperAdmin, deleteSede);

module.exports = router;