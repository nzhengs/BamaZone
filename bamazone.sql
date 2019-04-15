DROP DATABASE IF EXISTS bamazondb;
create database bamazondb;
use bamazondb;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10 , 2 ) NOT NULL,
    stock_available INT,
    PRIMARY KEY (item_id)
);
insert into products (product_name, department_name, price, stock_available)
 values
 ("Tomatoes","Groceries", 1.25,100  ),
 ("Milk", "Dairy", 2.7, 50),
 ("Laptop", "Electronics", 550,10),
 ("Bed", "Furnitures",490,10),
 ("Microwave", "Kitchenware",250,16),
 ("Lamp", "Electrical", 11.20, 30),
 ("Donut", "Bakery", 1.5, 100),
 ("Notebook","Stationary", .99,160),
 ("Doormat","Household", 2.60,20)
 
 