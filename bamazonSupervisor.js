let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
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
    afterConnection()
});

let afterConnection = () => {
    inquirer.prompt([
        {
            name: "supervisorFunctions",
            message: "What would you like to do?",
            type: "list",
            choices: ["View Product Sales By Department", "Create New Department"]
        }
    ]).then(inquirerResponse => {
        if(inquirerResponse.supervisorFunctions === "View Product Sales By Department"){
            //do a block of code
        }else if(inquirerResponse.supervisorFunctions === "Create New Department"){
            
        }
    })
}