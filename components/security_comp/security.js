const express = require('express');
const jwt = require('jsonwebtoken');
const response = require('../../network/response');
require('dotenv').config();

const app = express();
app.use(express.json());
const { SECRET } = process.env;

function validateUser(req, res, next) {
    try {
        req.token_info.is_admin ? next() : response.error(req, res, "Sin autorización - No eres admin", 401, 'Token no contiene permisos de admin[ValidateUser]');
    } catch (error) {
        console.log(error);
    }
}

const validateToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verification = jwt.verify(token, SECRET);
        req.token_info = verification;
        next();
    } catch (error) {
        response.error(req, res, "token no válido", 401, error);
    }
}

const createToken = (req, res, payload) => {
    try {
        const token = jwt.sign(payload, SECRET);
        response.success(req, res, { token }, 200);
    } catch (error) {
        response.error(req, res, "No se pudo generar token", 401, error);
    }
}

function is_numeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value) ? value : !isNaN(parseFloat(value)) && isFinite(value);
}

module.exports = {
    validateToken,
    createToken,
    validateUser,
    is_numeric
}