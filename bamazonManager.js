const mysql = require("mysql");
const inquirer = require("inquirer");
const { table } = require('table');
const InquirerQuestion = require('./constructors')

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root1",
    database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start()
});

const start = () => {
    const ManagerWhatToDo = new InquirerQuestion("action", "Select Desired Action", "list", ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"])
    console.log(`-------------------------------------------------------------------------
    `)
    inquirer.prompt([ManagerWhatToDo])
        .then(inquirerResponse => {
            switch (inquirerResponse.action) {

                case "View Products for Sale":
                    viewProductsForSale();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;

            }
        })
}

const exit = () => {
    const WhatToDo = new InquirerQuestion("exit", "Have you completed your tasks?", "list", ["Continue Working", "Exit BAMazon Manager"])

    inquirer
        .prompt([WhatToDo])
        .then((inquirerResponse) => {
            if (inquirerResponse.exit === "Continue Working") {
                start();
            } else connection.end();
        })
}

const viewProductsForSale = () => {
    connection.query("SELECT * FROM products", (error, res) => {
        const data = [
            ["Product ID", "Product Name", "Price", "In Stock"]
        ];
        if (error) {
            console.log(error)
        }
        for (var i = 0; i < res.length; i++) {
            let dataArr = [res[i].id, res[i].product_name, res[i].price, res[i].stock_quantity]
            data.push(dataArr)
        }
        const output = table(data);
        console.log(output);
        exit();
    })
}

const viewLowInventory = () => {
    connection.query("SELECT * FROM products WHERE stock_quantity<=?", [4], (error, res) => {
        const data = [
            ["Product ID", "Product Name", "In Stock"]
        ];
        if (error) {
            console.log(error)
        }
        for (let i = 0; i < res.length; i++) {
            dataArr = [res[i].id, res[i].product_name, res[i].stock_quantity];
            data.push(dataArr);
        }
        const outcome = table(data);
        console.log(outcome);
        exit();
    })
}

const addToInventory = () => {
    const InputProductId = new InquirerQuestion("productID", "Input the product ID that you would like to purchase more of", "input")
    InputProductId.validate = function (value) {
        if (!isNaN(value) && value <= 0) {
            return false;
        } return true;
    }
    const InputPurchaseAmount = new InquirerQuestion("purchaseAmount", "Input the size of the order you would like to place.", "input")
    InputPurchaseAmount.validate = function (value) {
        if (!isNaN(value) && value <= 0) {
            return false;
        } return true;
    }

    inquirer.prompt([InputProductId, InputPurchaseAmount]).then((answer) => {
        let productId = parseInt(answer.productID);
        let purchaseQuantity = parseInt(answer.purchaseAmount);
        connection.query('SELECT * FROM products WHERE id=?', [productId], (error, res) => {
            if (error) {
                console.log(error)
            }
            let originalQuantity = res[0].stock_quantity;
            connection.query('UPDATE products SET ? WHERE ?',
                [{
                    stock_quantity: purchaseQuantity + originalQuantity,
                },
                {
                    id: productId
                }
                ],
                (error, results) =>{
                    if (error) {
                        console.log(error)
                    } console.log(results)
                    console.log(`Your order has been received and the inventory has been updated.`),
                        exit()
                })
        })
    })
}

const addNewProduct = () => {
    
    const InputProductName = new InquirerQuestion("newProduct", "Please input the name of the new product you'd like to add.", "input")
    InputProductName.validate = function (value) {
        if (value !== null) {
            return true
        } else return false
    }
    const InputDepartmentName = new InquirerQuestion("departmentName", "What department does this item belong in?", "input")
    InputDepartmentName.validate = function (value) {
        if (value !== null) {
            return true
        } else return false
    }
    const InputPrice = new InquirerQuestion("price", "How much will this item be sold for?", "input")
    InputPrice.validate = function (value) {
        if (!isNaN(value) && value !== null) {
            return true;
        } else return false;
    }
    const InputQuantity = new InquirerQuestion("quantity", "How many would you like to initially order for sale?", "input")
    InputQuantity.validate = function (value) {
        if (isNaN(value)) {
            return false
        } else return true;
    }

    inquirer.prompt([InputProductName, InputDepartmentName, InputPrice, InputQuantity]).then(answer => {
        let newProduct = answer.newProduct;
        let department = answer.departmentName;
        let price = answer.price;
        let quantity = answer.quantity || 0;
        connection.query(`INSERT INTO products (product_name,department_name,price,stock_quantity) 
                                        VALUES ('${newProduct}', '${department}', ${price}, ${quantity})`
            , (err, results) => {
                if (err) {
                    console.log(error)
                }
                console.log(results)
                console.log(`An order for ${newProduct}s has been placed and the product has been added to the database.`)
                exit();
            })
    })
}