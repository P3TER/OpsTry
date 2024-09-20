const express = require('express');
const router = express.Router();
const { verifySession, checkRole, roles, setSede } = require('../middleware/authMiddleware');
const usuarioController = require('../controllers/usuarioController');
const sedeController = require('../controllers/sedeController');
const equipoController = require('../controllers/equipoController');

// Rutas públicas
router.post('/login', usuarioController.login);
router.get('/login', (req, res) => res.render('login', { errMessage: '' }));

// Rutas protegidas
router.use(verifySession);

// Dashboard
router.get('/dashboard', (req, res) => res.render('dashboard'));

// Rutas de usuario
router.get('/usuarios', checkRole(roles.SUPER_ADMIN, roles.DIRECTOR), usuarioController.getUsuarios);
router.post('/usuarios', checkRole(roles.SUPER_ADMIN, roles.DIRECTOR, roles.VIGILANTE), setSede, usuarioController.createUsuario);
router.put('/usuarios/:id', checkRole(roles.SUPER_ADMIN, roles.DIRECTOR), usuarioController.updateUsuario);
router.get('/usuarios/:id', checkRole(roles.SUPER_ADMIN, roles.DIRECTOR, roles.VIGILANTE), usuarioController.getUsuario);

// Rutas de sede
router.get('/sedes', checkRole(roles.SUPER_ADMIN), sedeController.getSedes);
router.post('/sedes', checkRole(roles.SUPER_ADMIN), sedeController.createSede);
router.put('/sedes/:id', checkRole(roles.SUPER_ADMIN), sedeController.updateSede);

// Rutas de equipo
router.post('/equipos', checkRole(roles.VIGILANTE), equipoController.createEquipo);
router.get('/equipos', checkRole(roles.VIGILANTE, roles.USUARIO), equipoController.getEquipos);
router.put('/equipos/:id', checkRole(roles.VIGILANTE), equipoController.updateEquipo);
router.post('/equipos/:id/movimiento', checkRole(roles.VIGILANTE), equipoController.registrarMovimiento);

router.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('/login');
});

module.exports = router;