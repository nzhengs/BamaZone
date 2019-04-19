const mysql = require("mysql");
const inquirer = require("inquirer");
let Table = require("cli-table");
let chalk = require("chalk");

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

        "Add New Product",
        "Exit"
      ]
    })
    .then(function(res) {
      var response = res.action;
      console.log(response);

      switch (response) {
        case "View Products for Sale":
          viewProduct();
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          addNewProduct();

          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

function viewProduct() {
  console.log(
    chalk.yellow(
      "**************Below is the list of available stocks*******************"
    )
  );
  displayStock(askManager);
}

function lowInventory() {
  connection.query(
    "SELECT item_id, product_name,department_name,price,stock_available FROM products where stock_available<=5",
    function(err, res) {
      if (err) throw err;
      console.log(chalk.red("*****************LOW STOCK PRODUCTS!!!!!!!!!!!***********"))
      displayProducts(res);
      askManager();
    }
  );
}

function addNewProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please input the product name",
        name: "name"
      },
      {
        type: "input",
        message: "Please input department",
        name: "department"
      },
      {
        type: "input",
        message: "Please input price",
        name: "price",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        type: "input",
        message: "Please input the quantity",
        name: "quantity",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(response) {
      let newItem = [
        response.name,
        response.department,
        response.price,
        response.quantity
      ];
      connection.query(
        `Insert into products (product_name, department_name, price, stock_available)
      values(?,?,?,?)`,
        newItem,
        function(err, res) {
          if (err) throw err;
          console.log(
            chalk.yellow(
              "*******************Stock has been Updated****************"
            )
          );
          displayStock(function() {
            askManager();
          });
        }
      );
    });
}
function addInventory() {
  displayStock(function() {
    askStock();
  });
}
function displayStock(callback) {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    displayProducts(res);
    if (callback) {
      callback();
    }
  });
}

function displayProducts(products) {
  const tableDisplay = new Table({
    head: ["Item ID", "Product Name", "Department", "Price", "Qty Available"]
  });
  products.map(function(row) {
    let productRow = [
      row.item_id,
      row.product_name,
      row.department_name,
      "$" + row.price,
      row.stock_available
    ];
    tableDisplay.push(productRow);
  });
  console.log(tableDisplay.toString());
}

function askStock() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please input the item id you want to update",
        name: "id",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        type: "input",
        message: "Please input the quantity you want to update",
        name: "quantity",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(response) {
      var id = response.id;
      var updateQty = parseInt(response.quantity);
      updateStock(id, updateQty);
    });
}
function updateStock(id, qty) {
  let query =
    "UPDATE products SET stock_available = stock_available + ? WHERE item_id = ?";
  connection.query(query, [qty, id], function(err, res) {
    if (err) {
      console.log(err);
    }
    console.log(
      chalk.yellow("**************The stock has been updated*************")
    );
    displayStock(function() {
      askManager();
    });
  });
}
