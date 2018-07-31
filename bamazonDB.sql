DROP DATABASE IF EXISTS bamazondb;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INTEGER(10) AUTO_INCREMENT PRIMARY KEY NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  department_name VARCHAR (100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER(5) NULL
);

CREATE TABLE departments (
  department_id INTEGER(10) AUTO_INCREMENT PRIMARY KEY NOT NULL,
  department_name VARCHAR(200) NOT NULL,
  over_head_costs DECIMAL(10, 2) NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mattel Games UNO Card Game", "Games", 4.99, 21);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Too Faced La Creme Lipstick Unicorn Tears Lip Stick 0.11 Ounce Package May Vary", "Cosmetics", 17.47, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Womens and Mens Kids Water Shoes Barefoot Quick-Dry Aqua Socks for Beach Swim Surf Yoga Exercise", "Shoes", 9.99, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Classic Jansport Superbreak Backpack (Mltgry Floral (T5010A1))", "Luggage", 49.95, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nintendo Entertainment System: NES Classic Edition", "Games", 86.33, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lodge Miniature Skillet", "Kitchen & Dining", 4.69, 11);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dash Rapid Egg Cooker: 6 Egg Capacity Electric Egg Cooker with Auto Shut Off Feature - Black", "Kitchen & Dining", 19.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Koehler 15145 7.75 Inch White Tear Drop Oil Warmer", "Home Decor", 9.58, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Plant Paradox: The Hidden Dangers in 'Healthy' Foods That Cause Disease and Weight Gain", "Books", 17.39, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("NINNAYUAN Hi I'm Mat_ lovely outdoor/indoor doormat(23.6x15.7 inch) (brown)", "Home Decor", 11.23, 19);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Harry Potter and the Sorcerer's Stone DVD", "DVD", 12.99, 17);

ALTER TABLE products
ADD COLUMN product_sales DECIMAL(10, 2) NULL AFTER price;