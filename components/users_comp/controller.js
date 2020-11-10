const response = require('../../network/response');

function controllerUser(req, res, next) {
    let { username, password, fullname, email, phone, address } = req.body;

    if (!username || !password || !fullname || !email || !phone || !address) {
        res.status(400).json('Información incompleta o petición mal formulada');
    } else {
        next();
    }
}

function controllerLogin(req, res, next) {
    let { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json('Información incompleta o petición mal formulada');
    } else {
        next();
    }
}

module.exports = {
    controllerUser,
    controllerLogin,
};