/* const { response } = require('express'); */
const sequelize = require('../../store/conexion');
const { is_numeric } = require('../security_comp/security');
const response = require('../../network/response');
const querys = require('../../store/querys');

/* ---------------------------------------------ADD ORDERS -----------------------------------------------------*/
const addOrder = async(req, res) => {
    const user_id = req.token_info.user_id;
    let { payment_method, products } = req.body;

    let desiredProducts = [];
    products.forEach((element) => {
        desiredProducts.push(element.product_id)
    });

    await sequelize.query(`SELECT * FROM products WHERE product_id IN (${desiredProducts})`, { //busca los productos a guardar en la orden
            type: sequelize.QueryTypes.SELECT,
        })
        .then(async result => {
            /* Calcula el valor total con los precios de los productos */
            let total = 0;
            let description = "";
            let ord_id;
            let date = new Date();
            let dateNow = (`${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
            await result.forEach((product, index) => {
                total += product.price * products[index].amount;
                description += `${products[index].amount}x ${product.name}, `;
            });
            description = description.substring(0, description.length - 2);

            /* Inserta las ordenes */
            const insertOrder = await querys.insert(req, res, 'orders', 'status, date, description, payment_method, total, user_id', `'${"nueva"}', '${dateNow}', '${description}', '${payment_method}', ${total}, ${user_id}`);

            if (!!insertOrder) {
                ord_id = insertOrder;
                console.log("Number of records inserted: " + insertOrder[1] + " in table Orders");
                response.success(req, res, 'Orden agregado correctamente', 201);

            } else {
                response.error(req, res, "Error insertando ordenes", 400, 'Error insertando productos[addProducts]');

            }
            /* Inserta la cantidad de productos en cada tabla de ordenes por producto */
            await products.forEach(async(product) => {

                const insertOrder_products = await querys.insert(req, res, 'orders_products', 'order_id, product_id, product_amount', `${ord_id[0]}, ${product.product_id}, ${product.amount}`);

                if (!!insertOrder_products) {
                    console.log("Number of records inserted: " + insertOrder_products[1] + " in table Orders_Products");
                    response.success(req, res, 'Orden agregado correctamente', 201);
                } else {
                    response.error(req, res, "Error insertando productos", 400, 'Error insertando productos[addProducts]');
                }
            })
        }).catch(err => {
            response.error(req, res, "Error insertando productos", 400, err);
        });

}

/* ---------------------------------------------GET ORDERS -----------------------------------------------------*/
const getOrder = async(req, res) => {
    let is_admin = req.token_info.is_admin;
    let is_user = req.token_info.user_id;
    if (is_admin == 1) {
        //busca lista de productos
        alreadyExists = await querys.selectAll(req, res, 'orders');

        if (!!alreadyExists) {
            response.success(req, res, { alreadyExists }, 200);
        } else {
            response.error(req, res, 'Error buscando ordenes', 400, 'Error buscando ordenes [getOrder]');
        }
    } else { //Busca solo los productos de los usuarios
        getOrderById = await querys.selectDataById(req, res, 'orders', '*', 'user_id', is_user);

        if (!!getOrderById) {
            response.success(req, res, { getOrderById }, 200);
        } else {
            response.error(req, res, `Error buscando orden por la identificación ${is_user}`, 400, 'Error buscando orden[getOrder]');
        }
    };
};

/* ---------------------------------------------UPDATE ORDERS -----------------------------------------------------*/
const updateOrder = async(req, res) => {

    /* let id = next(); */
    let id = req.query.id ? is_numeric(req.query.id) : false;
    let { status } = req.body;

    try {
        alreadyExists = await querys.selectDataById(req, res, 'orders', 'order_id', 'order_id', id);

        if (!!alreadyExists) {
            await sequelize.query("UPDATE orders SET status = :status WHERE order_id = :order_id", {
                replacements: {
                    order_id: id,
                    status: status,
                },
            });
            res.status(200).json(`Orden ${id} fue modificada correctamente`);
        } else {
            res.status(404).json("No se encontraron resultados");
        }
    } catch (error) {
        response.error(req, res, `Error actualizando orden ${id}`, 400, error);
    };
};

/* --------------------------------------------- DELETE ORDERS -----------------------------------------------------*/
const deleteOrder = async(req, res) => {

    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parametro id');
    if (id != false) {

        alreadyExists = await querys.selectDataById(req, res, 'orders_products', 'order_id', 'order_id', id);

        if (!!alreadyExists) {

            await querys.delete(req, res, 'orders_products', 'order_id', id);
            deleteOrd = await querys.delete(req, res, 'orders', 'order_id', id);

            if (!!deleteOrd) {
                console.log("Number of rows delete: " + deleteOrd[0].affectedRows + " de la tabla ordernes");
                response.success(req, res, `Producto eliminado por id ${id}`, 200);
            } else {
                response.error(req, res, `Error no se pudo eliminar la orden ${id}`, 400, 'Error borrando de ordenes[deleteOrders]');
            }
        } else {
            alreadyExists = await querys.selectDataById(req, res, 'orders', 'order_id', 'order_id', id);

            if (!!alreadyExists) {
                deleteOrd = await querys.delete(req, res, 'orders', 'order_id', id);

                if (!!deleteOrd) {
                    console.log("Number of rows delete: " + deleteOrd[0].affectedRows + " de la tabla ordernes");
                    response.success(req, res, `Producto eliminado por id ${id}`, 200);
                } else {
                    response.error(req, res, `Error intentando borrar orden ${id}`, 400, 'Error eliminando orden[deleteOrders]');
                }
            } else {
                response.error(req, res, `Error no existe la orden ${id}`, 400, 'Error no existe la orden[deleteOrders]');
            }
        }
    } else {
        response.error(req, res, `Error se requiere el parametro id`, 400, 'Error query id[deleteOrders]');
    }
}

module.exports = {
    addOrder,
    updateOrder,
    deleteOrder,
    getOrder
}