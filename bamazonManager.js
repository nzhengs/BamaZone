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
  askManager();
});

function askManager() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",

        "View Low Inventory",

        "Add to Inventory",

        "Add New Product"
      ]
    })
    .then(function(res) {
      var response = res.action;
      console.log(response)

      switch (response) {
        case "View Products for Sale":
        connection.query("SELECT * FROM products"),
        function(err, results) {
          if (err) throw err;
          console.table(results);
        };
          break;
        case "View Low Inventory":
          break;
        case "Add to Inventory":
          break;
        case "Add New Product":
          break;
        default:
          console.log("please enter valid command");
          break;
      }
    });
}

function viewProduct() {
  connection.query("SELECT * FROM products"),
    function(err, results) {
      if (err) throw err;
      console.table(results);
    };
}

function lowInventory(){

}

function addInventory(){

}
function addNewProduct(){
  
}
