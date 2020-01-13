const container = () => {

const mysql = require("mysql");
const inquirer = require("inquirer");       //node modules being required for usage
const { table } = require('table');
const InquirerQuestion = require('./constructors');

const InputProductId = new InquirerQuestion("buy", "What is the ID of the product you would like to purchase?", "input")
InputProductId.validate = function (value) {
    if (!isNaN(value) && value > 0) {               //two constructed objects to be used for the inquirer objects
        return true;
    } else return false;
}
const InputProductQuantity = new InquirerQuestion("quantity", "Okay, how many would you like to purchase?", "input")
InputProductQuantity.validate = function (value) {
    if (!isNaN(value) && value > 0) {
        return true;
    } else return false;
}

const connection = mysql.createConnection({       //using the mysql node module to connect to my server
    host: "localhost",
    port: 3306,             //port number
    user: "root",               //my user name
    password: "root1",              //password and database name
    database: "bamazonDB"
});


connection.connect(err => {         //connecting to SQL DB
    if (err) throw err;
    console.log("connected as id " + connection.threadId);          //after connection it states your connection thread ID
    afterConnection()
});

const afterConnection = () => {     
    connection.query("SELECT * FROM products", (err, res) => {          //function being run after you connect
        if (err) throw err;
        let output;                                                         //query the server and select all the products for sale to be displayed in the terminal
        let data = [
            ["Product ID", "Product Name", "Price"]                     //data array that is used to populate the table that gets logged out
        ];
        for (let i = 0; i < res.length; i++) {
            let productArr = [res[i].id, res[i].product_name, res[i].price]     //for loop used to loop through the data the server is sending back and populate the table
            data.push(productArr)       //productArr is each individual row in the table. each row gets pushed.
        }
        output = table(data);       //table gets console logged to the terminal
        console.log(output);
        buyProduct()
    });
}
const exit = () => {              //function that lets users either exit or continue shopping based on which choice they make.
    const Exit = new InquirerQuestion("exit", "Would you like to continue shopping with BAMazon?", "list", ["Continue shopping", "Exit BAMazon"])

    inquirer
        .prompt([Exit]).then(inquirerResponse => {
            if (inquirerResponse.exit === "Continue shopping") {    //after making a purchase a response asking the user if they want to log out or continue shopping
                afterConnection();
            } else connection.end();
        })
}

const buyProduct = () => {            //function being run in order to buy something

    inquirer
        .prompt([InputProductId, InputProductQuantity]).then(answer => {
            const productId = parseInt(answer.buy);
            const amountToBuy = parseInt(answer.quantity);
            connection.query("SELECT * FROM products WHERE id=?", [productId], (err, res) => {      //DB queries the product with the ID the user input
                if (err) {
                    console.log(err);
                }
                let currentInventory = res[0].stock_quantity;               //setting variables based on the product's DB values
                let unitPrice = res[0].price
                let originalSales = res[0].product_sales;
                productQuantity = parseInt(amountToBuy)
                if (parseInt(res[0].stock_quantity) < parseInt(amountToBuy)) {      //if the user wants to buy more of a product than is in inventory an error message appears
                    console.log(`
Sorry, but we do not have enough ${res[0].product_name}s for that request
                    `);
                    exit();
                } else {
                    connection.query("UPDATE products SET ? WHERE ?",           //after a purchase, the inventory is updated based on how much the client purchased.
                        [{
                            stock_quantity: (currentInventory - amountToBuy),
                            product_sales: originalSales + (unitPrice * amountToBuy)
                        },
                        {
                            id: productId
                        }],
                        error => {
                            if (error) throw error;
                            console.log(`

Thank you for your purchase. Your total is $${unitPrice * amountToBuy}
                            
                            `)
                            exit();         
                        })
                }
            })
        })
}}
container()
