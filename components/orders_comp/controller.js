const response = require('../../network/response');
const { is_numeric } = require('../security_comp/security');

function controllerAddOrder(req, res, next) {
    let { payment_method, products } = req.body;
    if (typeof(products) != "object") {
        products = false;
    }
    if (!payment_method || !products) {
        response.error(req, res, 'No se envio correctamente metodo de pago o productos', 400, 'Error parametros malos[controllerUpdateOrder]');
    } else {
        next();
    }
}

async function controllerOrder(req, res, next) {

    let id = req.query.id ? await is_numeric(req.query.id) : false;
    let { status } = req.body;
    if (!status || !id) {
        response.error(req, res, 'No se envio identificacion o estatus', 400, 'Error parametros malos[controllerUpdateOrder]');
    } else {
        next();
    }
}

module.exports = {
    controllerAddOrder,
    controllerOrder,
};