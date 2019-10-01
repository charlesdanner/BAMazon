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

let checkStock = (productID, productQuantity) => {
    connection.query("SELECT * FROM products WHERE id=?", [productID], function(err, res) {
        // console.log(res);
        // console.log(res[0].stock_quantity)
        if(parseInt(res[0].stock_quantity) < parseInt(productQuantity)){
            console.log(`Sorry, but we do not have enough ${res[0].product_name}s for that request`);
        }else{
            console.log("chicken")
        }
        connection.end()
    }
    )}

function start() {
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
            console.log("answer.buy: " + answer.buy)
            console.log("answer.quantity: " + answer.quantity)
            checkStock(parseInt(answer.buy), parseInt(answer.quantity))
            
        });
        
}