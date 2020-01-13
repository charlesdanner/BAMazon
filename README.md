# BAMazon

## Description

BAMazon is a terminal based application that leverages Javascript, Node.js and MySQL. The main purpose for the application is to emulate the way that a real life database would work. BAMazon allows users to interact with the database as if they were a customer, a manager or the supervisor. As the customer, users can buy different products as long as they are in stock. The manager can search the database and see what products in their inventory are low and order more to be shipped to the store, add new items into the inventory and see how much in sales individual products have made the store. The supervisor is able to create new departments and see the net profit that each department is making based on sales vs the overhead cost of running the department.

## Prerequisites

1. A live server must be being run on the user's computer for this to work and the username, password and port must accurately reflect the user's own experience.
2. the node modules mysql, inquirer and table must be installed or the application will not run. Mysql contacts the database, inquirer allows for prompting the user and table allows the data being received to be displayed in a easy to read format.

## Under the Hood

BAMazon runs through the terminal. It uses the node module 'inquirer' to prompt the user to do something based on whether they're running the customer, manager or supervisor file. Whenever an action is declared, command is run through a conditional and depending on what command is selected a different function is read. If a customer wants to buy something they are asked for an index number and to select how much of what they want to buy they want. With the 'mysql' node module, node is able to communicate with the server and search the database for the item they want to buy. If the inventory is lower than the amount that they want to buy, then the user is told that there are not enough items in the inventory for that purchase. If there are enough items in the inventory to allow the customer to buy the amount they specified, then the table is altered by subtracting the orignal amount that was in the inventory by the number of items that they bought. It also adds the amount of money that they spent to the sales for that item.

https://github.com/charlesdanner/BAMazon/blob/master/screen_shots/bamazonCustomer.png?raw=true

The manager is able to do many different things. They are able to see a list of products for sale, view all low inventory items, add more items to the inventory and add new products to the inventory database. When a manager selects "View Products for Sale", node queries the server to bring back the product's ID, product name, price and inventory count. If a manager selects "View Low Inventory" the mysql node module has a much more narrowly defined search than the one before. Instead of bringing all items, it selects all items in the database where the inventory is less than 5. Add new product was a simple task to program. Instead of querying the database, bringing back data or altering pre-existing index values, an entire row products database is added based on different prompts given to the user. Inquirer prompts the user for the name of the product, the department that the product belongs in, and the price the item should be sold for. The last thing that managers are allowed to do is order more inventory for the different products that BAMazon has to offer. This was also fairly easy to accomplish from a programatic perspective. Node sends a query to the MySQL server based on the information that the user entered into the prompt. It checks the product ID number that matches the user input and adds the user defined quantity that they want to add to the inventory and logs to the user that the action was complete.

The supervisor file is where the application got a little tricky to figure out how to get things done. The supervisor is only allowed to do two different things. View products sales by department and create a new department. Creating a new department is fairly straightforward. Programatically it was done the same way that adding a new product was done in the manager file, but the schema for the departments table in the database is a little different than the products table. When users select "View products by Department" though, Node sends a query selector to the server and asks for server to send back data from both tables joined together. This is possible, because MySQL is a relational database and the two tables share a common thread, the departments for the items. A join by selector is executed in order to lump all the data from the different databases together. It creates a table that has the department id, department name, over head costs and product sales. The product sales is generating by adding together all the sales for all the items within that department and instead of listing it multiple times, the sum represents all instances of rows that contain that department in the products table. The net profit is then calculated by creating a custom alias that calculates the difference in the over head costs and the product sales for each department. Some departments make money and others don't. This is why this information is incredibly important and shows how joining databases can be an incredibly useful tool when applied to real life scenarios.

### Built With

* MySQL
* Javascript
* Node.js
* Node module inquirer
* Node module table
* Node module mysql

### Authors

* Charles Danner - https://github.com/charlesdanner

### Link

Because BAMazon is a terminal based application that runs based off of a server that is being run on the user's computer, a live version is not able to be linked to for use; however, below is a link to a screen recording of the app in action.
https://github.com/charlesdanner/BAMazon/raw/master/recording/screenRecording.wmv
