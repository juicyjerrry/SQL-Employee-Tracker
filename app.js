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
        "SELECT role.role_id, role.title FROM role;"
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
            "SELECT employee.emp_id, CONCAT(employee.first_name,' ',employee.last_name) AS manager FROM employee;"
        ).then(([managers]) => {
            let managerChoices = managers.map(({
                id,
                manager

            }) => ({
                value: id,
                name: manager
            }));

                inquirer.prompt(
                    [{
                        type: 'input',
                        name: 'firstName',
                        message: 'Please enter the first name of your employee',
                        validate: firstName => {
                            if (firstName) {
                                return true;
                            } else {
                                console.log('Please enter the first name of your employee');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Please enter the last name of your employee',
                        validate: lastName => {
                            if (lastName) {
                                return true;
                            } else {
                                console.log('Please enter the last name of your employee');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'title',
                        message: 'Select a title for the employee from the list below',
                        choices: titleChoices
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Select a manager for the employee from the list below',
                        choices: managerChoices
                    }

                    ])
                    .then(({ firstName, lastName, role, manager }) => {
                        connection.query(
                            'INSERT INTO employee SET ?',
                            {
                                first_name: firstName,
                                last_name: lastName,
                                role_id: role,
                                manager_id: manager
                            },
                            function (err, res) {
                                if (err) throw err;
                                console.log({ role, manager }) //idk lol
                            }
                        )
                    })
                    .then(() => viewAllEmployees())
            })
        })
}

const updateRole = () => {
    
};

promptMenu();