CREATE DATABASE DB_PROYECTO3;
USE DB_PROYECTO3;

CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR (60) NOT NULL,
  password VARCHAR (60) NOT NULL,
  full_name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  phone INT NOT NULL,
  delivery_address VARCHAR (60) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
  );

INSERT INTO
  users
VALUES
  (NULL,"elza","elza1234","elza pato","elzapato@gmail.com",56423354,"Calle 22 # 76 98",TRUE),
  (NULL,"omar","garita1234","omar garita","omargarita@mail.com",9836422,"Ciudadela don omar cll 1",FALSE),
  (NULL,"lola","mento1234","lola mento","lolamento@gmail.com",8472490,"Carrera 48 # 68 83",FALSE);
   
CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR (60) NOT NULL,
  price FLOAT NOT NULL,
  img_url VARCHAR(200) NOT NULL,
  description VARCHAR(150) NOT NULL
  );

INSERT INTO
  products
VALUES
  (NULL,"Hamburguesa clasica",22000,"https://via.placeholder.com/732","PAN AJONJOLI, 150 GRS DE CARNE 100% RES A LA PARRILLA, LECHUGA, TOMATE Y CEBOLLA"),
  (NULL,"Hamburguesa cheese and bacon",25000,"https://via.placeholder.com/237","CLÁSICA + QUESO CHEDDAR Y TOCINETA"),
  (NULL,"Hamburguesa sailor jerry",26500,"https://via.placeholder.com/200","PAN CAMPESINO ARTESANAL, 150 GRS DE CARNE 100% RES A LA PARRILLA, LECHUGAS HIDROPÓNICAS, CEBOLLAS CARAMELIZADAS, QUESO PHILADELPHIA Y TOCINETA BAÑADA EN BBQ SAILOR JERRY. SALSA: BBQ A BASE DE RON SAILOR JERRY."),
  (NULL,"Hamburguesa pampa",26000,"https://via.placeholder.com/666","PAN DE PAPA, 150GRS DE CARNE MEZCLADA 50% RES, 50% CHORIZO ARGENTINO, LECHUGA ROMANA, RÚGULA FRESCA, PIMIENTOS ASADOS Y QUESO PAPIALPA A LA PARRILLA."),
  (NULL,"Hamburguesa tropical",24000,"https://via.placeholder.com/444","PAN DE PAPA, 150GRS DE CARNE 100% RES A LA PARILLA, LECHUGA ROMANA, QUESO CREMA, PIÑA ASADA, LECHUGAS HIDROPÓNICAS Y QUESO COSTEÑO EMPANIZADO."),
  (NULL,"Soda michelada",5000,"https://via.placeholder.com/999","Soda, con limón y Sal"),
  (NULL,"Coca cola",3000,"https://via.placeholder.com/888","Sánguche de pan frances con miilanesa suprema o ternera frita, huevo frito, lechuga, tomate y porción de papas fritas");
  
CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  status VARCHAR(60) NOT NULL,
  date DATETIME NOT NULL,
  description VARCHAR(150) NOT NULL,
  payment_method VARCHAR (60) NOT NULL,
  total FLOAT NOT NULL,
  user_id INT NOT NULL DEFAULT "0",
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

INSERT INTO
  orders
VALUES
  (NULL,"nueva",NOW(),"1x Hamburguesa clasica, 1x Coca cola","Tarjeta de credito",25000,1),
  (NULL,"cancelada",NOW(),"1x Hamburguesa tropical","Efectivo",24000,3),
  (NULL,"pendiente",NOW(),"2x Hamburguesa pampa","Tarjeta de credito",52000,1),
  (NULL,"entregada",NOW(),"1x Hamburguesa sailor jerry","Efectivo",26500,3),
  (NULL,"cancelada",NOW(),"1x Soda michelada","Tarjeta de credito",5000,2),
  (NULL,"nueva",NOW(),"1x Hamburguesa cheese and bacon","Efectivo",25000,1);

CREATE TABLE orders_products (
  order_prod_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  product_amount INT NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(order_id),
  FOREIGN KEY(product_id) REFERENCES products(product_id)
);

INSERT INTO
  orders_products
VALUES
  (NULL, 1, 1, 1),
  (NULL, 1, 7, 1),
  (NULL, 2, 5, 1),
  (NULL, 3, 4, 2),
  (NULL, 4, 3, 1),
  (NULL, 5, 6, 1),
  (NULL, 6, 2, 1);