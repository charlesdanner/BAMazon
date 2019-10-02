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
                console.log("action taken: " + inquirerResponse.action)
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
        connection.query('SELECT * FROM products WHERE id=?', [productId],  (error, res) => {
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