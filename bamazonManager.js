// Require required npm packages
var inquirer = require("inquirer");
var mysql = require("mysql");

// Create connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazonDB"
 }
);

connection.connect(error => {
  if (error) throw error;
  menuOptions();
});

var inventoryID = [];
var chosenProduct;

function menuOptions() {
  inquirer.prompt({
    type: "list",
    message: "Please select an option:",
    choices: ["View Products for Sale", "View Low Inventory", "Add/Remove Inventory", "Add New Product", "Exit"],
    name: "option"
  }).then(function(input) {
    switch (input.option) {
      case "View Products for Sale":
        displayItems();
        break;
    
      case "View Low Inventory":
        lowInventory();
        break;

      case "Add/Remove Inventory":
        addInventory();
        break;

      case "Add New Product":
        addProduct();
        break;

      case "Exit":
        connection.end();
    };
  });
};


function displayItems() {
  connection.query("SELECT * FROM products", function(error, results) {
    if (error) throw error;
    console.log('\x1b[33m%s\x1b[0m',`
    ID.   DESCRIPTION  |  PRICE  |  INVENTORY
    -----------------------------------------`);
    for (let i = 0; i < results.length; i++) {
      console.log(`    ${results[i].item_id}.   ${results[i].product_name} | $${results[i].price} | ${results[i].stock_quantity} in stock`);        
    };
    console.log("")

    menuOptions();
  });
};


function lowInventory(){
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(error, results) {
    if (error) throw error;
    console.log('\x1b[33m%s\x1b[0m',`
    ID.   DESCRIPTION  |  PRICE  |  INVENTORY
    -----------------------------------------`);
    for (let i = 0; i < results.length; i++) {
      console.log(`    ${results[i].item_id}.   ${results[i].product_name} | $${results[i].price} | ONLY ${results[i].stock_quantity} in stock`);        
    };
    console.log("")

    menuOptions();
  });
};


function addInventory() {
  connection.query("SELECT * FROM products", function(error, results) {
    if (error) throw error;
    console.log('\x1b[33m%s\x1b[0m',`
    ID.   DESCRIPTION  |  PRICE  |  INVENTORY
    -----------------------------------------`);
    for (let i = 0; i < results.length; i++) {
      inventoryID.push(results[i].item_id);
      console.log(`    ${results[i].item_id}.   ${results[i].product_name} | $${results[i].price} | ${results[i].stock_quantity} in stock`);        
    };
    console.log("")
  
    inquirer.prompt({
      name: "product_id",
      message: "The inventory of which item would you like to adjust?",
      type: "input"
    }).then(function(item) {
      if (inventoryID.indexOf(parseInt(item.product_id)) === -1) {
        console.log('\x1b[33m%s\x1b[0m',"Please enter a valid item ID");
        addInventory();
      } else {
        chosenProduct = item.product_id;
        askQty();
      };
    });
  });
};

function askQty() {
  inquirer.prompt([{
    name: "action",
    message: "Would you like to ADD or REMOVE items from inventory?",
    type: "list",
    choices: ["Add", "Remove"]
  },
  {
    name: "quantity",
    message: "How many would you like to add/remove?",
    type: "input"
  }]).then(function(item) {
    var qty = parseInt(item.quantity);

    if (item.action === "Add") {
      connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${qty} WHERE item_id = ${chosenProduct};`, function(error, results) {
        if (error) throw error;
        console.log("\x1b[32m",`Inventory for item ${chosenProduct} succesfully added!
        `);
        // console.log(results);
        menuOptions();
      })
    } else {
      connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${qty} WHERE item_id = ${chosenProduct};`, function(error, results) {
        if (error) throw error;
        console.log("\x1b[91m",`Inventory for item ${chosenProduct} succesfully removed!
        `);
        // console.log(results);
        menuOptions();
      });
    }
  });
};


function addProduct() {
  
  inquirer.prompt([{
    name: "product_name",
    message: "What is the name of the product?",
    type: "input",
  },
  {
    name: "department_name",
    message: "To which department/category does this item belong?",
    type: "input"
  },
  {
    name: "price",
    message: "What is the price?",
    type: "input",
  },
  {
    name: "stock_quantity",
    message: "How many items of this product are there in stock?",
    type: "input",
  }]).then(function(item) {
  connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("${item.product_name}", "${item.department_name}", ${item.price}, ${item.stock_quantity});`, function(error, result) {
    if (error) throw error;
  });
    console.log('\x1b[33m%s\x1b[0m',`Success! Added ${item.product_name} to the inventory.
    `);
    menuOptions();
  });
};