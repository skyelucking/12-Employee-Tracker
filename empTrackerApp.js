// Require the database, prompting, and table formatting packages
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "NewLife2021!",
  database: "empTracker_DB",
});

//Opens the DB connection and starts the app
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runSearch();
  });

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "View All Roles",
        "Add Empoyee",
        "Remove Empoyee",
        "Update Empoyee Role",
        "Update Empoyee Manager",
        "Exit this and go outside for some fresh air",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewEmps();
          break;

        case "View All Employees By Department":
          viewEmpsByDept();
          break;

        case "View All Employees By Manager":
          viewEmpsByManager();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "Add Empoyee":
          addEmp();
          break;

        case "Add Empoyee":
          addEmp();
          break;

        case "Remove Empoyee":
          removeEmp();
          break;

        case "Update Empoyee Role":
          updateRole();
          break;

        case "Update Empoyee Manager":
          updateManager();
          break;

        case "Exit this and go outside for some fresh air":
          connection.end();
          break;
      }
    });
}

function viewEmps() {
  connection.query(
    `SELECT E.first_name as "First Name",
            E.last_name as "Last Name",
            R.title as Title,
            R.salary as Salary,
            D.dept_name as Department,
            EE.last_name as Manager
    FROM employee E
    INNER JOIN role R
            ON R.id = E.role_id
    INNER JOIN department D
          ON D.id = R.department_id
    INNER JOIN employee EE
          ON EE.id = E.manager_id`,
    function (err, res) {
      if (err) throw err;
      console.table("\n" + "---------------");
      console.table("Employee Table", res);
      console.table("---------------" + "\n");
      runSearch();
    }
  );
}

function viewEmpsByDept() {
  const query = "SELECT * FROM department;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          message: "Which Department would you like to view?",
          choices: () => {
            var choiceArray = [];
            for (const item of res) {
              choiceArray.push({ name: item.dept_name, value: item.id });
            }
            return choiceArray;
          },
        },
      ])
      .then((data) => {
        const query = `SELECT E.first_name as "First Name",
          E.last_name as "Last Name",
          R.title as Title,
          R.salary as Salary,
          D.dept_name as Department,
          EE.last_name as Manager
  FROM employee E
  INNER JOIN role R
          ON R.id = E.role_id
  
  INNER JOIN employee EE
        ON EE.id = E.manager_id

  INNER JOIN department D
        ON D.id = R.department_id
        Where ?`;
        connection.query(
          query,
          [
            {
              "E.department_id": data.choice,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.log(data.choice);

            console.table("Empoloyees By Department", res);
            runSearch();
          }
        );
      });
  });
}

function viewEmpsByManager() {
  const query = `
  SELECT id, first_name, last_name, manager_id 
  FROM employee  
  Where id IN (Select manager_id from employee);`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          message: "Which manager would you like to view?",
          choices: () => {
            var choiceArray = [];
            for (const item of res) {
              choiceArray.push({
                name: item.first_name + " " + item.last_name,
                value: item.id,
              });
            }
            return choiceArray;
          },
        },
      ])
      .then((data) => {
        const query = `SELECT E.first_name as "First Name",
          E.last_name as "Last Name",
          R.title as Title,
          R.salary as Salary,
          D.dept_name as Department,
          EE.last_name as Manager
  FROM employee E
  INNER JOIN role R
          ON R.id = E.role_id
  INNER JOIN department D
        ON D.id = R.department_id
        
  INNER JOIN employee EE
        ON EE.id = E.manager_id
        Where ?`;
        connection.query(
          query,
          [
            {
              "E.manager_id": data.choice,
            },
          ],
          (err, res) => {
            if (err) throw err;

            console.table(res);
            runSearch();
          }
        );
      });
  });
}
