DROP DATABASE IF EXISTS empTracker_DB;
CREATE DATABASE empTracker_DB;

USE empTracker_DB;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NULL,
  PRIMARY KEY (id)
  
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(40) NULL,
  salary DECIMAL(10,2) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  department_id INT NULL,
  manager_id INT NULL,
  role_id INT NULL,
  PRIMARY KEY (id)
);


INSERT INTO department (dept_name)
VALUES
 ("Accounting"), 
 ("Customer Service"), 
 ("Reception"),
 ("Sales"),
 ("Warehouse"),
 ("Management"),
 ("Supplier Relations"),
 ("Quality Control")
 ;

 INSERT INTO role (title, salary, department_id)
VALUES
 ("Senior Accountant", 70000, 1), 
 ("Staff Accountant", 60000, 1), 
 ("Customer Service Rep", 55000, 2), 
 ("Receptionist", 55000, 3),
 ("Sales Rep", 65000, 4),
 ("Warehouse Foreman", 50000, 5),
 ("Assistant TO THE Regional Manager", 60000, 6 ),
 ("Vice President", 100000, 6),
 ("Regional Manager", 80000, 6),
 ("Supplier Relations", 50000, 7),
 ("Quality Assurance Rep", 50000, 8)
 
 ;

INSERT INTO employee (first_name, last_name, department_id, manager_id, role_id)
VALUES
 
("David", "Wallace", 6, null, 8), 
("Michael", "Scott", 6, 1, 9), 
("Angela", "Martin", 1, 2, 1), 
("Kevin", "Malone", 1, 3, 2), 
("Oscar", "Martinez", 1, 3, 2), 
("Tom", "Peets", 1, 3, 2), 
("Kelly", "Kapoor", 3, 2, 3), 
("Pam", "Beesly", 3, 2, 4),
("Jim", "Halpert", 4, 2, 5)
("Dwight", "Schrute", 4, 2, 7)
("Darryl", "Philbin", 5, 1, 6),
("Meredith", "Palmer", 7, 2, 10),
("Creed", "Bratton", 8, 2, 11),
("Phyllis", "Vance", 4, 2, 5),
("Stanley", "Hudson", 4, 2, 5)
  ;

