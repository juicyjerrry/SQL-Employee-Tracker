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
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Give a name to the department you will be adding',
        validate: deptName => {
            if (deptName) {
                return true;
            } else {
                console.log('Give a name to the department you will be adding');
                return false;
            }
        }
    }
    ])
        .then(name => {
            connection.promise().query("INSERT INTO department SET ?", name);
            viewAllDepartments();
        })
};

const addRole = () => {
    // calling departmentChoices into function so there is a selection menu
    connection.promise().query(
        "SELECT department.dept_id, department.name FROM department;"
    )
        .then(([departments]) => {
            let departmentChoices = departments.map(({
                id,
                name
            }) => ({
                name: name,
                value: id
            }))

            inquirer.prompt(
                [{
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the added role',
                    validate: titleName => {
                        if (titleName) {
                            return true;
                        } else {
                            console.log('Enter the title of the added role');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department are you from?',
                    choices: departmentChoices
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter your salary with number characters only!',
                    validate: salary => {
                        if (salary) {
                            return true;
                        } else {
                            console.log('Enter your salary with number characters only!');
                            return false;
                        }
                    }
                }
                ]
            )
                .then(({ title, department, salary }) => {
                        connection.query(
                        'INSERT INTO role SET ?',
                        {
                            title: title,
                            department_id: department,
                            salary: salary
                        },
                        function (err, res) {
                            if (err) throw err;
                            console.log(`role added successfully!`)
                        }
                    )
                }).then(() => viewAllRoles())}
        )};

const addEmployee = () => {

    return connection.promise().query(
        "SELECT R.id, R.title FROM role R;"
    )
        .then(([employees]) => {
            let titleChoices = employees.map(({
                id,
                title

            }) => ({
                value: id,
                name: title
            }))

            connection.promise().query(
                "SELECT E.id, CONCAT(E.first_name,' ',E.last_name) AS manager FROM employee E;"
            ).then(([managers]) => {
                let managerChoices = managers.map(({
                    id,
                    manager
                }) => ({
                    value: id,
                    name: manager
                }));
                }
        )},
};

const updateRole = () => {
    
};

promptMenu();