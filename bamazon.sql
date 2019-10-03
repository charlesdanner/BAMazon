DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products(
id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(40) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT(10) NOT NULL,
product_sales DECIMAL(10,2) DEFAULT 0,
PRIMARY KEY (id)
);

CREATE TABLE departments (
	department_id INT NOT NULL auto_increment,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
				VALUES	('snacks', 300),
						('toys', 800),
                        ('electronics', 2000),
                        ('books', 400),
                        ('furniture', 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES 	('doritos', 'snacks', 6.50, 50, 650), 
		('gushers', 'snacks', 4.99, 100, 325.25), 
        ('barbie', 'toys', 10.99, 40, 307.72),
        ('slinky', 'toys', 5.00, 30, 150),
        ('xbox', 'electronics', 200, 20, 3000), 
        ('playstation4', 'electronics', 250, 20, 3500), 
        ('Stranger in a Strange Land', 'books', 10.25, 20, 102.50), 
        ('Starship Troopers', 'books', 10.25, 20, 153.75), 
        ('chair', 'furniture', 30.99, 20, 1797.42), 
        ('sofa', 'furniture', 100.50, 20, 603);

SELECT * FROM products; 