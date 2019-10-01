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
        for(let i = 0; i < res.length; i++){
            console.log(`| ${res[i].id} | ${res[i].product_name} | ${res[i].price} |`)
        }


        //connection.end();
    });
}

function start() {
    inquirer
      .prompt({
        name: "buy",
        type: "input",
        message: "What is the ID of the product you would like to purchase?",
        validate: function(value){
            if(!isNaN(value)){
                return true;
            }else return false;
        }
      },)
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.postOrBid === "POST") {
          postAuction();
        }
        else if(answer.postOrBid === "BID") {
          bidAuction();
        } else{
          connection.end();
        }
      });
  }