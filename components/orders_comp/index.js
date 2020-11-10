const routerOrders = require('express').Router();
const { addOrder, getOrder, updateOrder, deleteOrder } = require('./orders');
const { validateToken, validateUser } = require('../security_comp/security');
const { controllerOrder, controllerAddOrder } = require('./controller');

routerOrders.post('/addOrder', validateToken, controllerAddOrder, addOrder);
routerOrders.get('/getOrder', validateToken, getOrder);
routerOrders.put('/updateOrder', validateToken, validateUser, controllerOrder, updateOrder);
routerOrders.delete('/deleteOrder', validateToken, validateUser, deleteOrder);

module.exports = routerOrders;