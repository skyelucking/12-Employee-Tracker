// Require the database, prompting, and table formatting packages
// require('events').EventEmitter.prototype._maxListeners = 100;
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
var fs = require('fs');

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
  logo();
  
});
//Displays Ascii Art Logo Welcome Screen
function logo(){
  var fs = require('fs');
  var path = require('path');
  var readStream = fs.createReadStream(path.join(__dirname, '../12-Employee-Tracker') + '/theOffice.txt', 'utf8');
  let data = ''
  readStream.on('data', function(chunk) {
      data += chunk;
  }).on('end', function() {
      console.log(data);
      runSearch();
  });
  };
     
  //Top Menu of Actions
function runSearch() {
  inquirer
    .prompt({
      name: "action",
      pageSize: 25,
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Get Total Utilized Budget by Department",
        "----VIEW----",
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "View Employees By Role",
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

        case "View Role Details":
          listRoles();
          break;

        case "View Employees By Role":
          viewEmpsByRoles();
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

        case "Remove Employee":
          removeEmp();
          break;

        case "Remove Department":
          removeDept();
          break;

        case "Remove Role":
          removeRole();
          break;

        case "Exit this and go outside for some fresh air":
          byeDwight();
          break;
      }
    });
}
//Bonus: total utilized budget: sum of all employees in a department
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
        const query = `SELECT  
        SUM(R.salary) as "Salary Totals" ,
        D.dept_name as Department,
         D.id,
        R.department_id
        FROM employee E
INNER JOIN role R
        ON R.id = E.role_id
INNER JOIN department D
      ON D.id = R.department_id
INNER JOIN employee EE
      ON D.id = EE.department_id 
      Where EE.department_id = ${data.department_id};`;
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
            
        runSearch();
        
          }
        );
      });
  });
}

//****VIEW SECTION STARTS****//
//MinReq: View All Employees

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
//MinReq: View All Employees by Department
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
            // console.log(data.choice);
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

//MinReq: View All Employees by Manager
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

//MinReq: View All Role Types
function listRoles() {
  const query = `
  SELECT title as "Role Titles", salary as "Salary"
  FROM role`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);

    runSearch();
    
  });
}

//MinReq: View All Employees in a certain Role
function viewEmpsByRoles() {
  const query = "SELECT * FROM role;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "role_id",
          pageSize: 10,
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
        Where ?`;
        connection.query(
          query,
          [
            {
              "E.role_id": data.role_id,
            },
          ],
          (err, res) => {
            if (err) throw err;
            // console.log(data.choice);
            console.table(
              "\n" + "---------------------------------------------"
            );

            console.table("Empoloyees By Role", res);
            console.table(
              "\n" + "---------------------------------------------"
            );

            runSearch();
           
          }
        );
      });
  });
}

//MinReq: View All Department Types
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
//****ADD SECTION STARTS****//
//MinReq: Add New Employee
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
        // console.log("dept_id: ", data.department_id);
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
//MinReq: Add New Deparment
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
//MinReq: Add New Role
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
            const query = "INSERT INTO role SET ? ";
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

//****UPDATE  SECTION STARTS****//
//MinReq: Update Employee Role
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
        // console.log(employee_id);
        // console.log(data.employee_id);
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
            .then((data) => {
              role_id = data.role_id;
              // console.log(role_id);
              // console.log(data.role_id);
              console.log(
                "role id: " + role_id + " Employee id :" + employee_id
              );
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
      });
  });
}

function updateManager() {
  let employee_id;
  let manager_id;
  const query = `
  SELECT E.first_name,
            E.last_name,
            E.id,
            E.manager_id
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
          message: "Which employee's manager would you like to update?",
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
        // console.log(employee_id);
       
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
                message: "Who is their new manager?",
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
              // console.log(manager_id);
              // console.log(data.manager_id);
              console.log(
                "manager id: " + manager_id + " Employee id :" + employee_id
              );
              const query = "UPDATE employee SET ? WHERE ? ";
              connection.query(
                query,
                [
                  {
                    manager_id: manager_id,
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
      });
  });
}

//****REMOVE  SECTION STARTS****//

//BONUS: Remove Employee
function removeEmp() {
  let employee_id;
  const query = "SELECT * FROM employee;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employee_id",
          type: "list",
          message: "Which employee would you like to delete?",
          choices: () => {
            var choiceArray = [];
            for (const item of res) {
              choiceArray.push({ name: item.first_name + " " + item.last_name, value: item.id });
            }
            return choiceArray;
          },
        },
      ])
      .then((data) => {
        employee_id = data.employee_id;
        const query = `Delete from employee where id = ${data.employee_id}`;
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + " employee removed!\n");
          viewEmps();
          runSearch();
        });
      });
  });
}

//BONUS: Remove Department
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
          listDept();
          runSearch();
        });
      });
  });
}

//BONUS: Remove Role
function removeRole() {
  const query = "SELECT * FROM role;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "role_id",
          type: "list",
          message: "Which role would you like to delete?",
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
        const query = `Delete from role where id = ${data.role_id}`;
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + " role removed!\n");
          listRoles();
          runSearch();
        });
      });
  });
}

//Displays Ascii Art Logo Goodbye Screen and Closes Connection
function byeDwight(){
  var fs = require('fs');
  var path = require('path');
  var readStream = fs.createReadStream(path.join(__dirname, '../12-Employee-Tracker') + '/byeDwight.txt', 'utf8');
  let data = ''
  readStream.on('data', function(chunk) {
      data += chunk;
  }).on('end', function() {
      console.log(data);
      connection.end();
  });
  };


  
 

