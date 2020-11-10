const routerUser = require('express').Router();
const { CreateUser, login, getUser, updateUser, deleteUser } = require('./users');
const { validateToken, validateUser } = require('../security_comp/security');
const { controllerUser, controllerLogin } = require('./controller');

routerUser.post('/login', controllerLogin, login);

routerUser.post('/createUser', controllerUser, CreateUser);
routerUser.get('/getUser', validateToken, getUser);
routerUser.put('/updateUser', validateToken, validateUser, controllerUser, updateUser);
routerUser.delete('/deleteUser', validateToken, validateUser, deleteUser);

module.exports = routerUser;