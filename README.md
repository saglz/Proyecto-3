# **DELILAH RESTÓ - PROYECTO 3**

**API "Delilah Restó" backend, esta diseñada para restaurantes de comida.**

El proyecto consiste en una API Rest, que permite al usuario administrar una lista de usuarios, productos y pedidos de un restaurante.
La API permite la conexión con una base de datos MySQL para almacenar y administrar los datos de Restaurante.

*Características:*

- Registro y login de usuarios.
- Validaciones del perfil administrador o no.
- Funciones CRUD de los productos
- Funciones CRUD de pedidos

## Recursos y tecnologías utilizadas

- Node.js
- Nodemon
- Express
- JWT para autenticación via Token
- MySQL
- Sequelize
- Postman para manejo de endpoints y testing
- Swagger para documentación de API

Documentación de la API:

Abrir el archivo documentation.yml y copiar su contenido en [Swagger](https://editor.swagger.io/) o importar el mismo desde las opciones.

Allí encontraras la información necesaria para utilizar los endpoint, con sus características.

Inicio del Proyecto => =>
### 1 - Clonar repositorio

`git clone https://github.com/saglz/Proyecto-3.git`

### 2 - Instalación de dependencias

```
npm install
```
Esto te permitirá instalar los siguientes paquetes: `dotenv, express, helmet, jsonwebtoken, mysql2, sequelize`

### 3 - Creando base de datos

- Abrir XAMPP y asegurarse que el puerto sobre el cual se está ejecutando es el `3306`
- Inicializar los servicios de Apache y MySQL
- Abrir el panel de control del servicio MySQL
- Generar una nueva base de datos llamada `db_proyecto3` desde el panel de control
- Abrir el archivo en `/store/bd.sql` y dentro del `panel de control` aparece la opción sql que te permitirá cargar todo el código sql o puedes importar el mismo el archivo db.sql.

Crear archivo .env con los siguientes datos

DB_HOST=localhost
DB_NAME=db_proyecto3
DB_USER=root
DB_PASS=
DB_PORT=3306
SECRET=PROJECT4_DELILAH_RESTO

### 4 - Iniciando el servidor

Ejecutar en node el archivo `/server.js` que esta en la raíz con el comando:

`node server`

### 5 - Listo, ahora puedes hacer uso de esta.

Realizar uso de los diferentes endpoint teniendo en cuenta la documentación para identificar cuales requieren autentificación(Token) o parámetros.

