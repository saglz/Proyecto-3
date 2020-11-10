const express = require('express');
const helmet = require('helmet');

const routerUser = require('./components/users_comp');
const routerOrders = require('./components/orders_comp');
const routerProducts = require('./components/products_comp');

const app = express();
app.use(helmet());
app.use(express.json());

/* Routes */
app.use('/', routerUser); //User
app.use('/v1', routerOrders); //Orders 
app.use('/v1', routerProducts); //Products

//Server

app.listen(3000, () => {
    console.log(`Servidor iniciado en http://localhost:3000`);
});