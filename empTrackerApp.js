var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "NewLife2021!",
  database: "empTracker_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    logEmpTable();
    logRoleTable();
    logDepartmentTable();
  });
  
  function logEmpTable() {
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      console.table('Employee Table', res);
    //   connection.end();
    });
  }

  function logRoleTable() {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      console.table('Role Table', res);
    //   connection.end();
    });
  }

  function logDepartmentTable() {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      console.table('Role Table', res);
    //   connection.end();
    });
  }
  
  