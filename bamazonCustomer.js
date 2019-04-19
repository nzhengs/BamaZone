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
  console.log(
    chalk.blue(
      "***************************************************************"
    )
  );
  console.log(
    chalk.green(
      "******************Welcome to the Bamazone**********************"
    )
  );
  console.log(
    chalk.green(
      "******************Cool Place to buy stuffs*********************"
    )
  );
  console.log(
    chalk.blue(
      "***************************************************************"
    )
  );

  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Do You want place order?",
      choices: ["Sure", "Exit"]
    })
    .then(function(res) {
      var response = res.action;
      console.log(response);

      switch (response) {
        case "Sure":
          displayItems();
          break;
        case "Exit":
          console.log(chalk.blue("Thank you for shopping"));
          connection.end();
          break;
      }
    });
});

function displayItems() {
  let tableDisplay = new Table({
    head: ["Item ID", "Product Name", "Department", "Price", "Qty Available"]
  });
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    res.map(function(row) {
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
    askCustomer();
  });
}

function askCustomer() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please input the item id you want to buy",
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
        message: "Please input the quantity you want to buy",
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
      // console.log(response);
      var id = response.id;
      var orderQty = parseInt(response.quantity);
      // console.log(orderQty);
      // console.log(id);
      displayStock(id, orderQty);
    });
}

function displayStock(id, orderQty) {
  let query = "SELECT stock_available,price FROM products  WHERE item_id = ?";

  connection.query(query, [id], function(err, res) {
    if (err) throw err;
    // console.log(JSON.parse(JSON.stringify(res)));
    let availabeStock = parseInt(res[0].stock_available);
    let unitPrice = parseFloat(res[0].price);
    if (availabeStock < orderQty) {
      console.log(
        chalk.yellow(
          "****************Insufficinet quantity to meet the order***************"
        )
      );
      console.log(
        chalk.yellow(
          "*****************Please select other items to buy or decrease the quantity of order*************"
        )
      );
      askCustomer();
    } else {
      let totalPrice = orderQty * unitPrice;
      availabeStock = availabeStock - orderQty;
      console.log(
        chalk.yellow(
          "**************Congratulation Your Order has been placed***************"
        )
      );
      console.log(chalk.red("Your Total price: $" + totalPrice.toFixed(2)));
      updateProduct(id, availabeStock);
      inquirer
        .prompt({
          name: "action",
          type: "list",
          message: "Do You want to buy again?",
          choices: ["Sure", "Exit"]
        })
        .then(function(res) {
          var response = res.action;
          console.log(response);

          switch (response) {
            case "Sure":
              displayItems();
              break;
            case "Exit":
              console.log(
                chalk.blue(
                  "################Thank you for shopping#################"
                )
              );
              connection.end();
              break;
          }
        });
    }
  });
}

function updateProduct(id, qty) {
  let query = "UPDATE products SET stock_available = ? WHERE item_id = ?";
  connection.query(query, [qty, id], function(err, res) {
    if (err) {
      console.log(err);
    }
  });
}
