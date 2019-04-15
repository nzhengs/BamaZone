const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  displayItems();
});

function displayItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    connection.end();
    askCustomer();
  });
}

function askCustomer() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please input the item id you want to buy",
        name: "id"
      },
      {
        type: "input",
        message: "Please input the quantity you want to buy",
        name: "quantity"
      }
    ])
    .then(function(response) {
      console.log(response);
    });
}
