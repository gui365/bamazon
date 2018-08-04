// Require required npm packages
var inquirer = require("inquirer");
var mysql = require("mysql");
var keys = require("./keys");

// Create connection
var connection = mysql.createConnection(keys.keys);

connection.connect(error => {
  if (error) throw error;
  displayItems();
});

var inventoryID = [];
var chosenProduct = -1;
var updatedQty = 0;

console.log('\x1b[33m%s\x1b[0m',`
                                                              ....                                                                         
                                                  .,************************.                                                              
                                             .***********************************,       ,*                                                
                                         ,*******,.                          .,******,    **.                                              
                                      ,****,                                        .***   **                                              
   %&&%#                            ***                                                    **.                                             
   @@@@&                          *.                                               ,*********,                                             
   @@@@#                                                                                                                                   
   @@@@#   .,,.             (&@@@@(        ***,  .%@&(     (&@#          .#@@@@&/      &            /       ,%&@&/        ****   (&@#.     
   @@@@#&@@@@@@@@#       &@@@@@@@@@@@#    (@@@@*@@@@@@@%.@@@@@@@@,     @@@@@@@@@@@@*   @@@@@@@@@@@@@@     @@@@@@@@@@*     @@@@.@@@@@@@@.   
   @@@@@@@@##@@@@@@,    @@@@@*  .@@@@@    (@@@@@@@@@@@@@@@@@@@@@@@   .@@@@@.  /@@@@@   &@@@@@@@@@@@@@   /@@@@&  ,@@@@@    @@@@@@@@@@@@@@   
   @@@@@,      @@@@@,     .*     /@@@@,   (@@@@/   .@@@@@    &@@@@     .,*     &@@@@,       .,@@@@@@   .@@@@#    .@@@@%   @@@@@    &@@@@   
   @@@@(        @@@@@      ,%@@@@@@@@@,   (@@@@.    @@@@%    %@@@@       *%@@@@@@@@@,        @@@@@%    %@@@@*     @@@@@   @@@@#    (@@@@   
   @@@@,        @@@@@   ,@@@@@@%@@@@@@,   (@@@@.    @@@@%    %@@@@    (@@@@@@%#@@@@@,      ,@@@@@.     &@@@@,     @@@@@   @@@@(    (@@@@   
   @@@@#        @@@@@  /@@@@@    /@@@@,   (@@@@.    @@@@%    %@@@@   &@@@@#    &@@@@,     &@@@@@       #@@@@/     @@@@@   @@@@(    (@@@@   
   @@@@@(      @@@@@   @@@@@/    @@@@@(   (@@@@.    @@@@%    %@@@@   @@@@@.   .@@@@@#   ,@@@@@,         @@@@@    /@@@@/   @@@@(    (@@@@   
  @@@@@@@@@&@@@@@@@    #@@@@@&(&@@@@@@@%  (@@@@.    @@@@%    %@@@@   @@@@@@%(@@@@@@@@/ /@@@@@@@@@@@@(    @@@@@%#@@@@@(    @@@@(    (@@@@   
   %@@@ (@@@@@@@@.      (@@@@@@@@. @@@(   (@@@@.    @@@@%    %@@@@    &@@@@@@@@ ,@@@(  /@@@@@@@@@@@@(     (@@@@@@@@@      @@@@(    (@@@@   
                                                                                                                                           
`);

// Show all items in the database
function displayItems() {
  connection.query("SELECT * FROM products", function(error, results) {
    if (error) throw error;
    console.log (`
  Our products:
  ------------`);
    for (let i = 0; i < results.length; i++) {
      // Push item_id to an array for input validation in next function (sellItem)
      inventoryID.push(results[i].item_id);
      console.log(`    ${results[i].item_id}. ${results[i].product_name} | ${results[i].price}`);        
    };
    console.log("")

    // Call the sellItem function in order to prompt the user to make a product choice
    sellItem();
  });
};

// Ask the user which item they'd like to purchase and how many 
function sellItem() {
  // console.log(inventoryID);
  
  inquirer.prompt({
      name: "product_id",
      message: "Which item would you like to buy",
      type: "input"
  }).then(function(item) {
    if (inventoryID.indexOf(parseInt(item.product_id)) === -1) {
      console.log("Please enter a valid item ID");
      sellItem();
    } else {
      chosenProduct = item.product_id;
      askQty();
    };
  });
};

function askQty() {
  inquirer.prompt({
    name: "n",
    message: "How many would you like to buy?",
    type: "input"
  }).then(function(quantity) {
    var numberItems = parseInt(quantity.n);
    
    connection.query(`SELECT * FROM products WHERE item_id=${chosenProduct}`, function(error, product) {
      if (error) throw error;
      
      if (isNaN(numberItems)) {
        console.log("Please enter a number");
        askQty();
      } else if (numberItems > product[0].stock_quantity) {
        console.log("\x1b[91m",`
  Insufficient quantity! We're sorry, we only have ${product[0].stock_quantity} of those
  `);
        sellItem();
      } else {
        console.log("\x1b[32m",`
  Order placed successfully! Your total is $${Math.round(product[0].price * numberItems * 100) / 100}. Please allow 5-8 business days for shipping.
  `);
        updatedQty = product[0].stock_quantity - numberItems;
        
        connection.query(`UPDATE products SET product_sales = product_sales + (${numberItems} * ${product[0].price}) WHERE item_id = ${chosenProduct};`, function(error, results) {
          if (error) throw error;

        });

        updateDB();
      };
    });
  });
};

function updateDB() {
  connection.query(`UPDATE products SET stock_quantity = ${updatedQty} WHERE item_id = ${chosenProduct};`, function(error, results) {
    if (error) throw error;
    
    inquirer.prompt({
      type: "confirm",
      message: "Would you like to place another order?",
      name: "confirm"
    }).then(function(confirmation) {
      if (confirmation.confirm) {
        displayItems();
      } else {
        connection.end();
      };
    });
  })
};