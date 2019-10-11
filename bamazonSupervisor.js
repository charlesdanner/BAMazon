const mysql = require("mysql");
const inquirer = require("inquirer");
const { table } = require('table');
const InquirerQuestion = require('./constructors')

const WhatToDo = new InquirerQuestion('supervisorFunctions', "What would you like to do?", "list", ["View Product Sales By Department", "Create New Department", "Exit"])
const QuestionOne = new InquirerQuestion("newDept", "What is the name of the new department you want to create?", "input")
QuestionOne.validate = function (value) {
    if (value.length > 3 && isNaN(value)) {
        return true
    } return false
}
const QuestionTwo = new InquirerQuestion("overHead", "What is the estimated overhead this new department will cost?", "input")
QuestionTwo.validate = function (value) {
    if (!isNaN(value) && value > 0) {
        return true;
    } else return false;
}



const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root1",
    database: "bamazonDB"
});


connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection()
});

const afterConnection = () => {
    inquirer.prompt([WhatToDo])
        .then(inquirerResponse => {
            if (inquirerResponse.supervisorFunctions === "View Product Sales By Department") {
                viewProductSalesByDepartment();
            } else if (inquirerResponse.supervisorFunctions === "Create New Department") {
                createNewDepartment();
            } else connection.end();
        })
}
const viewProductSalesByDepartment = () => {
    connection.query(
        `SELECT 
                department_id, department_name, over_head_costs, product_sales,
                (product_sales - over_head_costs) AS total_profit
        FROM
                departments
                    INNER JOIN
                        products USING (department_name)
        GROUP BY department_id`,
        (err, results) => {
            if (err) {
                console.log(err)
            }
            const data = [
                ["Department ID", "Department Name", "Over Head Costs", "Product Sales", "Total Profit"]
            ]
            for (let i = 0; i < results.length; i++) {
                let dataArr = [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].product_sales, results[i].total_profit];
                data.push(dataArr)
            }
            const output = table(data);
            console.log(output);
            afterConnection();
        }
    )
}

const createNewDepartment = () => {
    inquirer.prompt([QuestionOne, QuestionTwo])
        .then(answer => {
            const newDepartment = answer.newDept;
            const overHead = answer.overHead;
            connection.query(`INSERT INTO departments (department_name, over_head_costs) 
                                VALUES ('${newDepartment}', ${overHead})`,
                (err, results) => {
                    if (err) {
                        console.log(err)
                        console.log(`Department Not able to be created.`)
                    }else {console.log(results)
                     console.log(`New Department: ${newDepartment} has been successfully created.`)
                    }
                    afterConnection();
                }
            )
        })
}