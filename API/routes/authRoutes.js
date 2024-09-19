const express = require('express');
const { 
    login, 
    registerUsuario, 
    getDepartamentosCiudades, 
    refreshSession, 
    perfil, 
    getUsuariosByRol, 
    getUsuarios, 
    checkSession, 
    getSessionStatus, 
    logOut, 
    updateUsuario
} = require('../controllers/authController.js');
const { verifySession } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Rutas públicas
router.post('/registrarUsuario', registerUsuario);
router.post('/login', login);
router.get('/departamentos-ciudades', getDepartamentosCiudades);

// Rutas protegidas (requieren autenticación)
router.get('/perfil/:id_usuario', verifySession, perfil);
router.put('/actualizar/:numero_documento', verifySession, updateUsuario)
router.get('/usuarios', verifySession, getUsuarios);  // Consulta todos los usuarios
router.get('/usuarios-por-rol', verifySession, getUsuariosByRol);  // Consulta por rol
router.get('/refresh-session', verifySession, refreshSession);
router.get('/check-session', checkSession);
router.get('/session-status', verifySession, getSessionStatus);
router.post('/logout', logOut);

module.exports = router;
