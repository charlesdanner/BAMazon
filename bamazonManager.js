const container = () => {

    const mysql = require("mysql");
    const inquirer = require("inquirer");           //node modules being required
    const { table } = require('table');
    const InquirerQuestion = require('./constructors')  //constructor file being required


    //a bunch of constructed objects to be used in the inquirer prompt
    const ManagerWhatToDo = new InquirerQuestion("action", "Select Desired Action", "list", ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"])
    const Exit = new InquirerQuestion("exit", "Have you completed your tasks?", "list", ["Continue Working", "Exit BAMazon Manager"])
    const InputProductId = new InquirerQuestion("productID", "Input the product ID that you would like to purchase more of", "input")
    InputProductId.validate = function (value) {
        if (!isNaN(value) && value <= 0) {
            return false;
        } return true;
    }
    const InputPurchaseAmount = new InquirerQuestion("purchaseAmount", "Input the size of the order you would like to place.", "input")
    InputPurchaseAmount.validate = function (value) {
        if (!isNaN(value) && value <= 0) {
            return false;
        } return true;
    }
    const InputProductName = new InquirerQuestion("newProduct", "Please input the name of the new product you'd like to add.", "input")
    InputProductName.validate = function (value) {
        if (value !== null) {
            return true
        } else return false
    }
    const InputDepartmentName = new InquirerQuestion("departmentName", "What department does this item belong in?", "input")
    InputDepartmentName.validate = function (value) {
        if (value !== null) {
            return true
        } else return false
    }
    const InputPrice = new InquirerQuestion("price", "How much will this item be sold for?", "input")
    InputPrice.validate = function (value) {
        if (!isNaN(value) && value !== null) {
            return true;
        } else return false;
    }
    const InputQuantity = new InquirerQuestion("quantity", "How many would you like to initially order for sale?", "input")
    InputQuantity.validate = function (value) {
        if (isNaN(value)) {
            return false
        } else return true;
    }


    const connection = mysql.createConnection({     //connecting to the SQL DB using these params
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

    const start = () => {

        console.log(`-------------------------------------------------------------------------
    `)
        inquirer.prompt([ManagerWhatToDo])
            .then(inquirerResponse => {                     //based on the user's inquirer choice a different function runs
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

    const exit = () => {        //prompt the user to exit the application if they want

        inquirer
            .prompt([Exit])
            .then(inquirerResponse => {
                if (inquirerResponse.exit === "Continue Working") {
                    start();
                } else connection.end();
            })
    }

    const viewProductsForSale = () => {
        connection.query("SELECT * FROM products", (error, res) => {        //queries DB to show all products
            const data = [
                ["Product ID", "Product Name", "Price", "In Stock"]     //array to set up the node module table headers
            ];
            if (error) {
                console.log(error)
            }
            for (var i = 0; i < res.length; i++) {
                let dataArr = [res[i].id, res[i].product_name, res[i].price, res[i].stock_quantity] //for grabbing the values for the different DB entries
                data.push(dataArr)
            }
            const output = table(data);
            console.log(output);        //table being output
            exit();
        })
    }

    const viewLowInventory = () => {
        connection.query("SELECT * FROM products WHERE stock_quantity<=?", [4], (error, res) => {       //query search selecting all products with low inventory
            const data = [
                ["Product ID", "Product Name", "In Stock"]
            ];
            if (error) {
                console.log(error)
            }
            for (let i = 0; i < res.length; i++) {
                dataArr = [res[i].id, res[i].product_name, res[i].stock_quantity];      //grabbing the data from each entry
                data.push(dataArr);
            }
            const outcome = table(data);
            console.log(outcome);           //outputing the data into a table
            exit();
        })
    }

    const addToInventory = () => {
        inquirer.prompt([InputProductId, InputPurchaseAmount]).then(answer => {  //adding more products to inventory
            let productId = parseInt(answer.productID);     //sets user inputs to variables
            let purchaseQuantity = parseInt(answer.purchaseAmount);
            connection.query('SELECT * FROM products WHERE id=?', [productId], (error, res) => {    //query search the product with the ID the user put in
                if (error) {
                    console.log(error)
                }
                let originalQuantity = res[0].stock_quantity;
                connection.query('UPDATE products SET ? WHERE ?',
                    [{
                        stock_quantity: purchaseQuantity + originalQuantity,    //update the DB entry based on original quantity and purchase quantity
                    },
                    {
                        id: productId
                    }
                    ],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                        } console.log(results)
                        console.log(`Your order has been received and the inventory has been updated.`),
                            exit()
                    })
            })
        })
    }

    const addNewProduct = () => {   //add a new product for sale
        inquirer.prompt([InputProductName, InputDepartmentName, InputPrice, InputQuantity]).then(answer => {
            let newProduct = answer.newProduct;
            let department = answer.departmentName;     //save the user inputs to variables
            let price = answer.price;
            let quantity = answer.quantity || 0;
            connection.query(`INSERT INTO products (product_name,department_name,price,stock_quantity)
                                        VALUES ('${newProduct}', '${department}', ${price}, ${quantity})` //query the DB and set the new row equal to the user inputs
                , (err, results) => {
                    if (err) {
                        console.log(error)
                    }
                    console.log(results)
                    console.log(`An order for ${newProduct}s has been placed and the product has been added to the database.`)
                    exit();
                })
        })
    }
}
container()