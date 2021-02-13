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
        "View All Employees in Roles",
        "Add Empoyee",
        "Remove Empoyee",
        "Update Empoyee Role",
        "Update Empoyee Manager",
        "Add Department",
        "Remove Department",
        "Exit this and go outside for some fresh air",
        new inquirer.Separator(),
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

        case "View All Employees in Roles":
          viewRoles();
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

        case "Add Department":
          addDept();
          break;

        case "Remove Department":
          removeDept();
          break;

        case "Exit this and go outside for some fresh air":
          connection.end();
          break;
      }
    });
}
// Employee with no manager is not showing up
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
      console.table("\n" + "---------------------------------------------");
      console.table("Employee Table", res);
      console.table("\n" + "---------------------------------------------");

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
            console.table(
              "\n" + "---------------------------------------------"
            );

            console.table("Empoloyees By Department", res);
            console.table(
              "\n" + "---------------------------------------------"
            );

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
            console.table(
              "\n" + "---------------------------------------------"
            );
            console.table("Empoloyees By Manager", res);
            console.table(
              "\n" + "---------------------------------------------"
            );
            runSearch();
          }
        );
      });
  });
}

function addEmp() {
  let department_id;
  let role_id;
  let manager_id;
  const query = "SELECT * FROM department;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "department_id",
          type: "list",
          message: "Which Department would you like to add an employee to?",
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
        console.log("dept_id: ", data.department_id);
        department_id = data.department_id;
        const query = `SELECT * FROM role WHERE department_id = ${data.department_id};`;
        connection.query(query, (err, res) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: "role_id",
                type: "list",
                message: "Which role would you like to add the employee to?",
                choices: () => {
                  var choiceArray = [];
                  for (const item of res) {
                    
                    choiceArray.push({ name: item.title, value: item.id });
                  }
                  return choiceArray;
                },
              },
            ])
            .then((data) => {
              role_id = data.role_id;
              const query = `SELECT id, first_name, last_name, manager_id 
              FROM employee  
              Where id IN (Select manager_id from employee);`;
              connection.query(query, (err, res) => {
                if (err) throw err;
                inquirer
                  .prompt([
                    {
                      name: "manager_id",
                      type: "list",
                      message: "Who will be the new employee's manager",
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
                    manager_id = data.manager_id;
                    inquirer
                      .prompt([
                        {
                          name: "first_name",
                          type: "input",
                          message: "Employee's first name:",
                        },
                        {
                          name: "last_name",
                          type: "input",
                          message: "Employee's last name:",
                        },
                      ])
                      .then((data) => {
                        const query = "INSERT INTO employee SET ?";
                        const params = {
                          first_name: data.first_name,
                          last_name: data.last_name,
                          department_id: department_id,
                          role_id: role_id,
                          manager_id: manager_id,
                        };
                        connection.query(query, params, (err, res) => {
                          if (err) throw err;
                          console.log(
                            res.affectedRows + " employee added!\n"
                          );
                          viewEmps();
                          runSearch();
                        });
                      });
                  });
              });
            });
        });
      });
  });
}

function viewRoles() {
  const query = `
  SELECT * from role`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          message: "Which role would you like to view?",
          choices: () => {
            var choiceArray = [];
            for (const item of res) {
              choiceArray.push({ name: item.title, value: item.id });
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
        EE.last_name as Manager
FROM employee E
INNER JOIN employee EE
      ON EE.id = E.manager_id
INNER JOIN role R
        ON R.id = E.role_id
WHERE ?;`;
        connection.query(
          query,
          [
            {
              "E.role_id": data.choice,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.table(
              "\n" + "---------------------------------------------"
            );
            console.table("Empoloyees By Role", res);
            console.table("---------------------------------------------");
            runSearch();
          }
        );
      });
  });
}

function updateRole() {
  const query = `
  SELECT E.first_name,
            E.last_name,
            E.id 
       FROM employee E
    `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          message: "Which employee would you like to update?",
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
        connection.query(
          `SELECT E.first_name as "First Name",
    E.last_name as "Last Name",
    R.title as Title,
    R.salary as Salary,
    EE.last_name as Manager,
FROM employee E
 E.id WHERE ?
;`,
          function (err, res) {
            if (err) throw err;
            console.table(
              "\n" + "---------------------------------------------"
            );
            console.table("Empolyee Info", res);
            console.table(
              "\n" + "---------------------------------------------"
            );

            runSearch();
          }
        );
      });
  });
}

function addDept() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Which Department would you like to add?",
      },
    ])
    .then((data) => {
      const query = "INSERT INTO department SET ?";
      const params = {
        dept_name: data.department,
      };
      connection.query(query, params, (err, res) => {
        if (err) throw err;
        console.log(res.affectedRows + " department added!\n");
        //TO-DO: Add a VIEW DEPT function
        runSearch();
      });
    });
}

function removeDept() {
  const query = "SELECT * FROM department;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "department_id",
          type: "list",
          message: "Which Department would you like to delete?",
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
        const query = `Delete from department where id = ${data.department_id}`;
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + " department removed!\n");
          //TO-DO: Add a VIEW DEPT function
          runSearch();
        });
      });
  });
}
