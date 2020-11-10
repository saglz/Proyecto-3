const routerProducts = require('express').Router();
const { addProducts, getProducts, updateProducts, deleteProducts } = require('./products');
const { validateToken, validateUser } = require('../security_comp/security');
const { controllerProducts } = require('./controller');

routerProducts.post('/addProducts', validateToken, validateUser, controllerProducts, addProducts);
routerProducts.get('/getProducts', validateToken, getProducts);
routerProducts.put('/updateProducts', validateToken, validateUser, controllerProducts, updateProducts);
routerProducts.delete('/deleteProducts', validateToken, validateUser, deleteProducts);


module.exports = routerProducts;