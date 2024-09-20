const roles = {
  SUPER_ADMIN: 'SuperAdmin',
  DIRECTOR: 'Director',
  VIGILANTE: 'Vigilante',
  USUARIO: 'Usuario'
};

const verifySession = (req, res, next) => {
  if (!req.cookies.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  req.user = JSON.parse(req.cookies.user);
  next();
};

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    next();
  };
};

const setSede = async (req, res, next) => {
  if (req.user.rol !== roles.SUPER_ADMIN) {
    req.body.sede_id = req.user.sede_id;
  }
  next();
};

module.exports = {
  roles,
  verifySession,
  checkRole,
  setSede
};