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
        // .then(function (answer) {
        //     // based on their answer, either call the bid or the post functions
        //     switch (answer) {
        //         case 1:
        //             // code block
        //             break;
        //         case 2:
        //             // code block
        //             break;
        //         case 3:
        //             // code block
        //             break;
        //         case 4:
        //             // code block
        //             break;
        //         case 5:
        //             // code block
        //             break;
        //         case 6:
        //             // code block
        //             break;
        //         case 7:
        //             // code block
        //             break;
        //         case 8:
        //             // code block
        //             break;
        //         case 9:
        //             // code block
        //             break;
        //         case 10:
        //             // code block
        //             break;


        //     }
        // });
        connection.end()
}