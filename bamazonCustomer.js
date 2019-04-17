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
      var id = response.id;
      var orderQty = parseInt(response.quantity);
      console.log(orderQty);
      console.log(id);
      displayStock(id, orderQty);
    });
}

function displayStock(id, orderQty) {
  let query = "SELECT stock_available,price FROM products  WHERE item_id = ?";

  connection.query(query, [id], function(err, res) {
    if (err) throw err;
    console.table(JSON.parse(JSON.stringify(res)));
    let availabeStock = parseInt(res[0].stock_available);
    let unitPrice = parseFloat(res[0].price);
    if (availabeStock <= orderQty) {
      console.log(
        "****************Insufficinet quantity to meet the order***************"
      );
      console.log(
        "***************Please select other items to buy*************"
      );
      askCustomer();
    } else {
      let totalPrice = orderQty * unitPrice;
      availabeStock = availabeStock - orderQty;
      console.log("Total price: " + totalPrice);
      console.log(availabeStock);
      updateProduct(id, availabeStock);
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
