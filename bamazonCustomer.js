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
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection()
});

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(`| ${res[i].id} | ${res[i].product_name} | ${res[i].price} |`)
        }

        start()
        //connection.end();
    });
}
let exit = () => {
    inquirer
        .prompt([
            {
                name: "exit",
                type: "list",
                message: "Would you like to continue shopping with BAMazon?",
                choices: ["Continue shopping", "Exit BAMazon"]
            }
        ]).then((inquirerResponse) => {
            if(inquirerResponse.exit === "Continue shopping"){
                afterConnection();
            } else connection.end();
        })
}

let start = () => {
    inquirer
        .prompt([{
            name: "buy",
            type: "input",
            message: "What is the ID of the product you would like to purchase?",
            validate: function (value) {
                if (!isNaN(value) && value > 0 && value < 11) {
                    return true;
                } else return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Okay, how many would you like to purchase?",
            validate: function (value) {
                if (!isNaN(value) && value > 0) {
                    return true;
                } else return false;
            }
        }]
        )
        .then(function (answer) {
            let productId = parseInt(answer.buy);
            let amountToBuy = parseInt(answer.quantity)
            console.log("answer.buy: " + productId)
            console.log("answer.quantity: " + amountToBuy)
            connection.query("SELECT * FROM products WHERE id=?", [productId], function (err, res) {
                // console.log(res);
                let currentInventory = res[0].stock_quantity;
                let unitPrice = res[0].price
                productQuantity = parseInt(amountToBuy)
                if (parseInt(res[0].stock_quantity) < parseInt(amountToBuy)) {
                    console.log(`
Sorry, but we do not have enough ${res[0].product_name}s for that request
                    `);
                    exit();
                } else {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: (currentInventory - amountToBuy)
                            },
                            {
                                id: productId
                            }
                        ],
                        function (error) {
                            if (error) throw error;
                            console.log(`

Thank you for your purchase. Your total is $${unitPrice * amountToBuy}
                            
                            `)
                            exit();
                        }
                    )
                }

            }
            )

        });

}