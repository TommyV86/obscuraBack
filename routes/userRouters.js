const express = require("express");
const routes = express.Router();
const { addUser, signInUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userControllers')


routes.post('/addUser', addUser);
routes.post('/signInUser', signInUser);
routes.get('/getUsers', getUsers);
routes.post('/getUserById', getUserById);
routes.put('/updateUser', updateUser);
routes.delete('/deleteUser', deleteUser);

module.exports = { routes };