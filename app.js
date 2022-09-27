const inquirer = require('inquirer');
const fs = require("fs");
const mysql = require('mysql2');
require ('console.table');
// const { createConnection } = require('net'); //where did this come from?

// connection to database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employeeDb',
    password: 'Cafecorazon96' //remember to change this before submitting
})

const promptMenu = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit']
        }])
        .then(userChoice => {
            switch (userChoice.menu) {
                case 'view all departments':
                    viewAllDepartments();
                    break;
                case 'view all roles':
                    viewAllRoles();
                    break;
                case 'view all employees':
                    viewAllEmployees();
                    break;
                case 'add a department':
                    addDepartment();
                    break;
                case 'add a role':
                    addRole();
                    break;
                case 'add an employee':
                    addEmployee();
                    break;
                case 'update an employee role':
                    updateRole();
                    break;
                default:
                    process.exit(); //https://nodejs.org/api/process.html#processabort
            }
        });
};

const viewAllDepartments = () => {
    connection.query(
    'SELECT * from department;', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptMenu();
    });
  };

const viewAllRoles = () => {
    connection.query(
    'SELECT * FROM role;', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptMenu();
      });
  };

const viewAllEmployees = () => {
    connection.query(
        'SELECT employee.emp_id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN department ON role.department_id = department.dept_id LEFT JOIN employee manager ON manager.emp_id = employee.manager_id;', (err, res) => {
            if (err) throw err;
            console.table(res);
            promptMenu();
          });
      };

const addDepartment = () => {
    
};

const addRole = () => {
    
};

const addEmployee = () => {
    
};

const updateRole = () => {
    
};

promptMenu();