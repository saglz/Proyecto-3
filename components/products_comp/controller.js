const response = require('../../network/response');

function controllerProducts(req, res, next) {
    let { name, price, img_url, description } = req.body;
    if (!name || !price || !img_url || !description) {
        response.error(req, res, 'Información incompleta o petición mal formulada', 400, 'Error parametros enviados [add products]');
    } else {
        next();
    }
}

module.exports = {
    controllerProducts
};