const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware para manejar formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para manejar cookies
app.use(cookieParser());

// Configura el view engine
app.set('view engine', 'ejs');

// Archivos estáticos (CSS, imágenes, etc.)
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

// Middleware para pasar la sesión a todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  next();
});

// Importar rutas
const routes = require('./routes/index');
app.use('/', routes);

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).render('pages/404');
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error del servidor');
});

const port = process.env.PORT || 3232;
app.listen(port, () => {
  console.log(`Frontend server running at http://localhost:${port}`);
});

module.exports = app;