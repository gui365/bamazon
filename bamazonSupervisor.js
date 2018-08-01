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
  connection.query(`SELECT departments.department_name,
                           products.product_sales,
                           departments.over_head_costs,
                           (products.product_sales - departments.over_head_costs) AS total_profit
                    FROM departments
                    LEFT JOIN products ON products.department_name = departments.department_name
                    GROUP BY departments.department_name;`, function(error, results) {
    console.log(`
Department      Sales      Costs      Profit
--------------------------------------------`);
    
    for (let i = 0; i < results.length; i++) {
      console.log(`${results[i].department_name}\t ${results[i].product_sales}\t ${results[i].over_head_costs}\t ${results[i].total_profit}`);
    };

    menuOptions();
  });
};


function createDepartment() {
  inquirer.prompt([{
    name: "department_name",
    message: "What is the name of the new department?",
    type: "input",
  },
  {
    name: "over_head_costs",
    message: "What are the over head costs for this department?",
    type: "input"
  }]).then(function(department) {
  
    connection.query(`INSERT INTO departments (department_name, over_head_costs)
  VALUES ("${department.department_name}", "${department.over_head_costs}");`, function(error, result) {
    if (error) throw error;
  });
  
  console.log('\x1b[33m%s\x1b[0m',`Success! ${department.department_name} was added to the table.
    `);
    menuOptions();
  });
};