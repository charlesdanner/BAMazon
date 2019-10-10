const mysql = require("mysql");
const inquirer = require("inquirer");
const { table } = require('table');

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
    afterConnection()
});

const afterConnection = () => {
    inquirer.prompt([
        {
            name: "supervisorFunctions",
            message: "What would you like to do?",
            type: "list",
            choices: ["View Product Sales By Department", "Create New Department", "Exit"]
        }
    ]).then(inquirerResponse => {
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
            if(err){
                console.log(err)
            }
            const data = [
                ["Department ID", "Department Name", "Over Head Costs", "Product Sales", "Total Profit"]
            ]
            for(let i = 0; i < results.length; i++){
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
    inquirer.prompt([
        {
            name: "newDept",
            message: "What is the name of the new department you want to create?",
            type: "input",
            validation: value => {
                if (value.length > 3 && isNaN(value)) {
                    return true
                } return false
            }
        },
        {
            name: "overHead",
            message: "What is the estimated overhead this new department will cost?",
            type: "input",
            validation: value => {
                if (!isNaN(value) && value > 0) {
                    return true;
                } else return false;
            }
        }
    ]).then(answer => {
        const newDepartment = answer.newDept;
        const overHead = answer.overHead;
        connection.query(`INSERT INTO departments (department_name, over_head_costs) 
                                VALUES ('${newDepartment}', ${overHead})`,
            (err, results) => {
                if (err) {
                    console.log(err)
                } console.log(`New Department: ${newDepartment} has been successfully created.`);
                afterConnection();
            }
        )
    })
}