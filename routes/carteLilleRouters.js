const express = require('express');
const routes = express.Router();
const { postDescription, getDescription } = require('../controllers/carteLilleControllers');

routes.post('/postDescription', postDescription);
routes.put('/getDescription', getDescription);

module.exports = { routes }