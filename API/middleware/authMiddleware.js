exports.verifySession = (req, res, next) => {
    if (req.session && req.session.usuario) {
        next();
    } else {
        res.status(401).json({ message: 'Acceso denegado (Token)' });
    }
};


exports.isSuperAdmin = (req, res, next) => {
    if (req.session.usuario.rol !== "SuperAdmin") {
        return res.status(403).json({ error: "Acceso solo válido para SuperAdmin" });
    }
    next();
};

exports.isDirector = (req, res, next) => {
    if (req.session.usuario.rol !== "Director") {
        return res.status(403).json({ error: "Acceso solo válido para Directores de sede" });
    }
    next();
};

exports.isVigilante = (req, res, next) => {
    if (req.session.usuario.rol !== "Vigilante") {
        return res.status(403).json({ error: "Acceso solo válido para Vigilantes" });
    }
    next();
};

exports.isUsuarioComun = (req, res, next) => {
    if (req.session.usuario.rol !== "Usuario") {
        return res.status(403).json({ error: "Acceso solo válido para Usuarios Comunes" });
    }
    next();
};