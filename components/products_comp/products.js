const sequelize = require('../../store/conexion');
const { is_numeric } = require('../security_comp/security');
const response = require('../../network/response');
const querys = require('../../store/querys');

/* ---------------------------------------------CREAR PRODUCTS -----------------------------------------------------*/
const addProducts = async(req, res) => {
    let { name, price, img_url, description } = req.body;

    alreadyExists = await querys.insert(req, res, 'products', 'name, price, img_url, description', `'${name}',${price},'${img_url}','${description}'`)

    if (!!alreadyExists) {
        console.log("Number of records inserted: " + alreadyExists[1]);
        response.success(req, res, 'Producto agregado correctamente', 201);
    } else {
        response.error(req, res, "Error insertando productos", 400, 'Error insertando productos[addProducts]');
    }
};

/* ---------------------------------------------GET PRODUCTS -----------------------------------------------------*/
const getProducts = async(req, res) => {
    let id = req.query.id ? is_numeric(req.query.id) : 'allproducts';

    if (id == 'allproducts') {

        getProductsQuery = await querys.selectAll(req, res, 'products');

        if (!!getProductsQuery) {
            response.success(req, res, { getProductsQuery }, 201);
        } else {
            response.error(req, res, 'Error buscando informacion', 400, 'Error buscando productos [getProducts]');
        }
    };
    if (id != false) {

        getProductsById = await querys.selectDataById(req, res, 'products', '*', 'product_id', id);

        if (!!getProductsById) {
            response.success(req, res, { getProductsById }, 201);
        } else {
            response.error(req, res, `Error buscando informacion por la identificación ${id}`, 400, 'Error buscando información[getProducts]');
        }

    } else {
        return response.error(req, res, 'El query de la ruta solo admite números', 400, 'Error en los parametros enviados');
    };
};

/* ---------------------------------------------UPDATE PRODUCTS -----------------------------------------------------*/
const updateProducts = async(req, res) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parametro id');
    let { name, price, img_url, description } = req.body;

    if (id != false) {
        await sequelize.query(`UPDATE products SET name='${name}', price=${price}, img_url='${img_url}', description='${description}' 
        WHERE  product_id=${id}`)
            .then(result => {
                response.success(req, res, 'Actualización satisfatoria', 200);
                console.log("Number of records update: " + result[0].affectedRows);
            }).catch(err => {
                response.error(req, res, 'No se pudo actualizar', 400, err);
            });
    }

};

/* ---------------------------------------------DELETE PRODUCTS -----------------------------------------------------*/
const deleteProducts = async(req, res) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parametro id');
    console.log(id);
    if (!id) {
        response.error(req, res, 'Falta parametro de identificación', 406, 'Error en el parametro de identificación[delete products]');
    } else {
        if (id != false) {
            /* Elimina de la tabla orders_products primero cuando existe una relacion con una orden */

            alreadyExists = await querys.selectDataById(req, res, 'orders_products', 'product_id', 'product_id', id);

            if (!!alreadyExists) {

                deleteOrderProduct = await querys.delete(req, res, 'orders_products', 'product_id', id);
                deleteProduct = await querys.delete(req, res, 'products', 'product_id', id);

                if (!!deleteProduct) {
                    response.success(req, res, `Producto eliminado por id ${id}`, 200);
                    console.log("Number of rows delete: " + deleteProduct[0].affectedRows);
                } else {
                    response.error(req, res, 'No se puede eliminar', 406, 'Error no se elimino ningun producto [delete productos]');
                }
            } else {
                /* Elimina directamente de la tabla de productos, si el producto no tiene ordenes asociadas */
                alreadyExistsProduct = await querys.selectDataById(req, res, 'products', 'product_id', 'product_id', id);

                if (!!alreadyExistsProduct) {

                    deleteProduct = await querys.delete(req, res, 'products', 'product_id', id);

                    if (!!deleteProduct) {
                        console.log("Number of rows delete: " + deleteProduct[0].affectedRows);
                        response.success(req, res, `Producto eliminado por id ${id}`, 200);
                    } else {
                        response.error(req, res, 'No se puede eliminar', 406, 'Error en el parametro de identificación');
                    }

                } else {
                    response.error(req, res, `No se puede eliminar producto con id:${id}`, 400, 'Error no existe el producto[delete products]');
                }
            }
        }
    }
};

module.exports = {
    addProducts,
    getProducts,
    updateProducts,
    deleteProducts,
}