const { createToken, validateAdmin, is_numeric } = require('../security_comp/security');
const sequelize = require('../../store/conexion');
const querys = require('../../store/querys');
const response = require('../../network/response');

/* ---------------------------------------------CREAR USUARIOS -----------------------------------------------------*/
const CreateUser = async(req, res) => {
    let { username, password, fullname, email, phone, address } = req.body;

    alreadyExists = await querys.selectDataByName(req, res, 'users', 'username', 'username', username);

    if (alreadyExists == "") {

        insertUser = await querys.insert(req, res, 'users', 'username, password, full_name, email, phone, delivery_address', `'${username}','${password}','${fullname}','${email}',${phone},'${address}'`)

        if (!!insertUser) {
            console.log("Number of records inserted: " + insertUser[1]);
            response.success(req, res, 'Usuario creado exitosamente', 201);
        } else {
            response.error(req, res, 'Error creando usuario', 400, 'Error insertando productos[addProducts]');
        }

    } else {
        response.success(req, res, 'Ya existe un usuario con el username, ingrese uno diferente', 200);
    }
}

/* ---------------------------------------------LOGIN USUARIOS -----------------------------------------------------*/
const login = async(req, res) => {
    let { username, password } = req.body;

    alreadyExists = await querys.selectDataByNameAnd(req, res, 'users', 'username', 'username', username, 'password', password);

    if (alreadyExists !== "") {

        payload = await querys.selectDataByName(req, res, 'users', 'user_id, full_name, email, is_admin', 'username', username);

        const sendpayload = {
            user_id: payload[0].user_id,
            fullname: payload[0].full_name,
            email: payload[0].email,
            is_admin: payload[0].is_admin
        };

        createToken(req, res, sendpayload);
    } else {
        response.error(req, res, 'Usuario o contraseña invalidos', 400, 'Error en el login,no existen usario o contraseña en la BD');
    }
};

/* ---------------------------------------------GET USUARIOS -----------------------------------------------------*/
const getUser = async(req, res) => {
    let is_admin = (req.token_info.is_admin == 1) ? 'is_admin' : req.token_info.user_id;
    if (is_admin == 'is_admin') {
        //busca lista de productos
        const result = await querys.selectAll(req, res, 'users');
        res.status(200).json(result);
    } else {
        const result = await querys.selectDataById(req, res, 'users', '*', 'user_id', is_admin);
        res.status(200).json(result);
    };
};

/* ---------------------------------------------UPDATE USUARIOS -----------------------------------------------------*/
const updateUser = async(req, res) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parametro id');
    let { username, password, fullname, email, phone, address } = req.body;
    if (id != false) {

        alreadyExists = await querys.selectDataById(req, res, 'users', 'username', 'user_id', id);

        if (!!alreadyExists) {

            await sequelize.query(`UPDATE users SET password='${password}', full_name='${fullname}', email='${email}', phone=${phone}, delivery_address='${address}'
             WHERE user_id=${id}`)
                .then(result => {
                    console.log("Number of records update: " + result[1]);
                    response.success(req, res, `Actualización realizada correctamente al username ${username}`, 200);
                }).catch(err => {
                    response.error(req, res, `Error actualizando el usario ${username}`, 400, err);
                });

        } else {
            response.error(req, res, `Error no existe el usuario ${id}`, 400, 'Error no existe usuario [updateUser]');
        }

    } else {
        response.error(req, res, `Falta la identificación en la ruta parametro query, debe ser númerica`, 400, `Error en parametro ruta query`);
    }

};

/* ---------------------------------------------DELETE USUARIOS -----------------------------------------------------*/
const deleteUser = async(req, res) => {

    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parametro id');

    if (!id) {
        res.status(406).json('Falta identificación');
    } else {

        if (id != false) {

            alreadyExists = await querys.selectDataById(req, res, 'users', 'username', 'user_id', id);

            if (!!alreadyExists) {

                sequelize.query(`DELETE FROM users WHERE user_id =${id}`) //borra el producto sino esta asociado a una orden
                    .then(result => {
                        if (result[1] != 0) {
                            console.log("Number of rows delete: " + result[1]);
                            response.success(req, res, `Usuario eliminado por id ${id}`, 200);
                        } else {
                            response.error(req, res, `No se puede eliminar el usuario con identificación ${id}`, 406, `Error eliminando [deleteUser]`);
                        }
                    }).catch(err => {
                        response.error(req, res, `Error no se puede borrar usuario porque tiene ordenes asociadas`, 400, err);
                    });
            } else {
                response.error(req, res, `No existe usuario a eliminar ${id}`, 400, 'No existe usuario a eliminar[deleteUser]');
            }
        }
    }
};

module.exports = {
    CreateUser,
    login,
    getUser,
    updateUser,
    deleteUser
}