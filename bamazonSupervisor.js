let mysql = require("mysql");
let inquirer = require("inquirer");
let {table} = require('table');

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
            choices: ["View Product Sales By Department", "Create New Department", "Exit"]
        }
    ]).then(inquirerResponse => {
        if(inquirerResponse.supervisorFunctions === "View Product Sales By Department"){
            //do a block of code
        }else if(inquirerResponse.supervisorFunctions === "Create New Department"){
            inquirer.prompt([
                {
                    name: "newDept",
                    message: "What is the name of the new department you want to create?",
                    type: "input",
                    validation: (value) => {
                        if(value.length > 3 && isNaN(value)){
                            return true
                        } return false
                    }
                },
                {
                    name: "overHead",
                    message: "What is the estimated overhead this new department will cost?",
                    type: "input",
                    validation: (value) => {
                        if(!isNaN(value) && value > 0){
                            return true;
                        } else return false;
                    }
                }
            ]).then(answer => {
                let newDepartment = answer.newDept;
                let overHead = answer.overHead;
                connection.query(`INSERT INTO departments (department_name, over_head_costs) 
                                        VALUES ('${newDepartment}', ${overHead})`,
                (err, results) => {
                    if(err){
                        console.log(err)
                    } console.log(`New Department: ${newDepartment} has been successfully created.`);
                    afterConnection();
                }
            )})
        } else connection.end();
    })
}