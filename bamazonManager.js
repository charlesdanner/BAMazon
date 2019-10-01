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
    start()
});

let start = () => {
    inquirer.prompt([{
        name: "action",
        message: "Select Desired Action",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]

    }]).then(function (inquirerResponse) {
        switch (inquirerResponse.action) {

            case "View Products for Sale":
               viewProductsForSale();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                console.log("action taken: " + inquirerResponse.action)
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
            if(inquirerResponse.exit === "Continue Working"){
                start();
            } else connection.end();
        })
}

let viewProductsForSale = () =>{
    connection.query("SELECT * FROM products", function(error, res){
        if(error){
            console.log(error)
        }
        for(let i = 0; i < res.length; i++){
            console.log(`| ${res[i].id} | ${res[i].product_name} | $${res[i].price} | ${res[i].stock_quantity}
------------------------------------------------------------------`)
        }
        exit();
    })
}

let viewLowInventory = () => {
    connection.query("SELECT * FROM products", function(error, res){
        if(error){
            console.log(error)
        }
        for(let i = 0; i < res.length; i++){
            if(res[i].stock_quantity < 5){
                console.log(`| ${res[i].id} | ${res[i].product_name} | ${res[i].stock_quantity}`)
            }           
        }
        exit();
    })
}