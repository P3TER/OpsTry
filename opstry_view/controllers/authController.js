const axios = require('axios');

const API_URL = 'http://localhost:3480';

const usuarioController = {
  getUsuarios: async (req, res) => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
  },

  createUsuario: async (req, res) => {
    try {
      const response = await axios.post(`${API_URL}/registerUsuario`, req.body);
      res.status(201).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
  },

  updateUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.put(`${API_URL}/actualizar/${id}`, req.body);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
  },

  getUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.get(`${API_URL}/usuarios/${id}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  }
};

module.exports = usuarioController;