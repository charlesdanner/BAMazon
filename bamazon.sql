DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products(
id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(40) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT(10) NOT NULL,
product_sales INT(10) DEFAULT 0,
PRIMARY KEY (id)
);

CREATE TABLE departments (
	department_id INT NOT NULL auto_increment,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs INT(10) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
values 	('doritos', 'snacks', 6.50, 50), 
		('gushers', 'snacks', 4.99, 100), 
        ('barbie', 'toys', 10.99, 40),
        ('slinky', 'toys', 5.00, 30),
        ('xbox', 'electronics', 200, 20), 
        ('playstation4', 'electronics', 250, 20), 
        ('Stranger in a Strange Land', 'books', 10.25, 20), 
        ('Starship Troopers', 'books', 10.25, 20), 
        ('chair', 'furniture', 30.99, 20), 
        ('sofa', 'furniture', 100.50, 20);

SELECT * FROM products; 