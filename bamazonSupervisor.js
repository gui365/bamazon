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
});

connection.connect(error => {
  if (error) throw error;
  menuOptions();
});


function menuOptions() {
  inquirer.prompt({
    type: "list",
    message: "Please select an option:",
    choices: ["View Product Sales by Department", "Create New Department", "Exit"],
    name: "option"
  }).then(function(input) {
    switch (input.option) {
      case "View Product Sales by Department":
        salesByDepartment();
        break;
    
      case "Create New Department":
        createDepartment();
        break;

      case "Exit":
        connection.end();
    };
  });
};

function salesByDepartment() {
  console.log("Sales by department");
  menuOptions();
};


function createDepartment() {
  console.log("Create department");
  menuOptions();
};