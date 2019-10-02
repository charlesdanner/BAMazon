var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
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

let start = () => {
    inquirer.prompt([{
        name: "action",
        message: "Select Desired Action",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]

    }]).then(inquirerResponse => {
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

let exit = () => {
    inquirer
        .prompt([
            {
                name: "exit",
                type: "list",
                message: "Have you completed your tasks?",
                choices: ["Continue Working", "Exit BAMazon Manager"]
            }
        ]).then((inquirerResponse) => {
            if (inquirerResponse.exit === "Continue Working") {
                start();
            } else connection.end();
        })
}

let viewProductsForSale = () => {
    connection.query("SELECT * FROM products", function (error, res) {
        if (error) {
            console.log(error)
        }
        for (let i = 0; i < res.length; i++) {
            console.log(`| ${res[i].id} | ${res[i].product_name} | $${res[i].price} | ${res[i].stock_quantity}
------------------------------------------------------------------`)
        }
        exit();
    })
}

let viewLowInventory = () => {
    connection.query("SELECT * FROM products WHERE stock_quantity<=?", [4], function (error, res) {
        if (error) {
            console.log(error)
        }
        for (let i = 0; i < res.length; i++) {
            console.log(`| ${res[i].id} | ${res[i].product_name} | ${res[i].stock_quantity}`)
        }
        exit();
    })
}

let addToInventory = () => {
    inquirer.prompt([
        {
            name: "productID",
            message: "Input the product ID that you would like to purchase more of",
            type: "input",
            validate: value => {
                if (!isNaN(value) && value <= 0) {
                    return false;
                } return true;
            }
        },
        {
            name: "purchaseAmount",
            message: "Input the size of the order you would like to place.",
            type: "input",
            validate: value => {
                if (!isNaN(value) && value <= 0) {
                    return false;
                } return true;
            }
        }
    ]).then((answer) => {
        let productId = parseInt(answer.productID);
        console.log(productId)
        let purchaseQuantity = parseInt(answer.purchaseAmount);
        console.log(purchaseQuantity)
        let originalQuantity;
        connection.query('SELECT * FROM products WHERE id=?', [productId], (error, res) => {
            if (error) {
                console.log(error)
            }
            originalQuantity = res[0].stock_quantity;
            console.log(res[0].stock_quantity);
            connection.query('UPDATE products SET ? WHERE ?',
                [{
                    stock_quantity: purchaseQuantity + originalQuantity,
                },
                {
                    id: productId
                }
                ],
                function () {
                    console.log(`Your order has been received and the inventory has been updated.`),
                        exit()
                }

            )

        });

    })
}

let addNewProduct = () => {
    inquirer.prompt([
        {
            name: "newProduct",
            message: "Please input the name of the new product you'd like to add.",
            type: "input",
            validation: (value) => {
                if (value !== null) {
                    return true
                } else return false
            }
        },
        {
            name: "departmentName",
            message: "What department does this item belong in?",
            type: "input",
            validation: (value) => {
                if (value !== null) {
                    return true
                } else return false
            }
        },
        {
            name: "price",
            message: "How much will this item be sold for?",
            type: "input",
            validation: (value) =>{
                if(!isNaN(value) && value !== null){
                    return true;
                } else return false;
            }
        },
        {
            name: "quantity",
            message: "How many would you like to initially order for sale?",
            type: "input",
            validation: (value) => {
                if(isNaN(value)){
                    return false
                } else return true;
            }
        }
    ]).then((answer) => {
        let newProduct = answer.newProduct;
        let department = answer.departmentName;
        let price = answer.price;
        let quantity = answer.quantity || 0;
        connection.query(`INSERT INTO products (product_name,department_name,price,stock_quantity) 
                                        VALUES ('${newProduct}', '${department}', ${price}, ${quantity})`
        ), function(err, results, fields){
            if(error){
                console.log(error)
            }
            console.log(`An order for ${newProduct}s has been placed and the product has been added to the database.`)
            exit();
        }
    })
}