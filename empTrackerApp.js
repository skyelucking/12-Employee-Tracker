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
      pageSize: 8,
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Get Total Utilized Budget by Department",
        "----VIEW----",
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "View All Employees by Role",
        "View List of Roles",
        "View Role Details",
        "View List of Departments",
        "----ADD----",
        "Add Employee",
        "Add Department",
        "Add Role",
        "----UPDATE----",
        "Update Empoyee's Role",
        "Update Empoyee's Manager",
        "----REMOVE----",
        "Remove Employee",
        "Remove Department",
        "Remove Role",
        "Exit this and go outside for some fresh air",
        new inquirer.Separator(),
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Get Total Utilized Budget by Department":
          getBudget();
          break;

        case "----VIEW----":
          runSearch();
          break;

        case "View All Employees":
          viewEmps();
          break;

        case "View All Employees By Department":
          viewEmpsByDept();
          break;

        case "View All Employees By Manager":
          viewEmpsByManager();
          break;

        case "View All Employees by Role":
          viewRoles();
          break;

        case "View List of Roles":
          listRoles();
          break;

        case "View Role Details":
          viewRoles();
          break;

        case "View List of Departments":
          listDept();
          break;

        case "----ADD----":
          runSearch();
          break;

        case "Add Employee":
          addEmp();
          break;

        case "Add Department":
          addDept();
          break;

        case "Add Role":
          addRole();
          break;

        case "----UPDATE----":
          runSearch();
          break;

        case "Update Empoyee's Role":
          updateRole();
          break;

        case "Update Empoyee's Manager":
          updateManager();
          break;

        case "----REMOVE----":
          runSearch();
          break;

        case "Remove Empoyee":
          removeEmp();
          break;

        case "Remove Department":
          removeDept();
          break;

        case "Remove Role":
          removeRole();
          break;

        case "Exit this and go outside for some fresh air":
          connection.end();
          break;
      }
    });
}

function getBudget() {
  const query = "SELECT * FROM department;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "department_id",
          pageSize: 9,
          type: "list",
          message: "Which Department's Budget would you like to view?",
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
        const query = `Select department_id, SUM(salary) as "Total Utilized Budget"
        from role
        Where ?`;
        connection.query(
          query,
          [
            {
              department_id: data.department_id,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.table(
              "\n" + "---------------------------------------------"
            );

            console.table("Total Budget By Department", res);
            console.table(
              "\n" + "---------------------------------------------"
            );

            runSearch();
          }
        );
      });
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
          pageSize: 10,
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

function listRoles() {
  const query = `
  SELECT title as "Role Titles"
  FROM role`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);

    runSearch();
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
          pageSize: 12,
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
        const query = `SELECT 
        R.id, 
        R.title as Title, 
        R.salary as Salary,
        D.dept_name as "Department Name"
        from role R
        INNER JOIN department D
          ON D.id = R.department_id
WHERE ?;`;
        connection.query(
          query,
          [
            {
              "R.id": data.choice,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.table("\n");
            console.table("Role Details", res);
            console.table("---------------------------------------------");
            runSearch();
          }
        );
      });
  });
}

function listDept() {
  const query = `
  SELECT dept_name as "Departments"
  FROM department`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);

    runSearch();
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
          pageSize: 10,
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
                          console.log(res.affectedRows + " employee added!\n");
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
        listDept();
        runSearch();
      });
    });
}

function addRole() {
  let department_id;
  const query = "SELECT * FROM department;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "department_id",
          pageSize: 10,
          type: "list",
          message: "Which Department would you like to add a role to?",
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
        department_id = data.department_id;
        inquirer
          .prompt([
            {
              name: "title",
              type: "input",
              message: "What is the title?",
            },
            {
              name: "salary",
              type: "input",
              message: "What is the salary?",
            },
          ])
          .then((data) => {
            const query = "INSERT INTO role SET ?";
            const params = {
              title: data.title,
              salary: data.salary,
              department_id: department_id,
            };
            connection.query(query, params, (err, res) => {
              if (err) throw err;
              console.log(res.affectedRows + " role added!\n");
              listRoles();
              runSearch();
            });
          });
      });
  });
}

function updateRole() {
  let employee_id;
  let role_id;
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
          name: "employee_id",
          pageSize: 12,
          type: "list",
          message: "Which employee's role would you like to update?",
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
        employee_id = data.employee_id;
        const query = `SELECT * FROM role`;
        connection.query(query, (err, res) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: "role_id",
                type: "list",
                message: "Which is the employee's new role?",
                choices: () => {
                  var choiceArray = [];
                  for (const item of res) {
                    choiceArray.push({ name: item.title, value: item.id });
                  }
                  return choiceArray;
                },
              },
            ])
        })
            .then((data) => {
              role_id = data.role_id;
              console.log("role id: "+ role_id + " Employee id :" + employee_id)
              const query = "UPDATE employee SET ? WHERE ? ";
              connection.query(
                query,
                [
                  {
                    role_id: role_id,
                  },
                  {
                    id: employee_id,
                  },
                ],
                (err) => {
                  if (err) throw err;
                  console.log("Employee Successfully Updated!");
                  viewEmps();
                  runSearch();
                }
              );
            });
        });
     })
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
