DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE TABLE department(
  dept_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE role(
  role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER,
  CONSTRAINT fk_department
  FOREIGN KEY(department_id)
  REFERENCES department(dept_id)
  ON DELETE SET NULL
);

CREATE TABLE employee(
  emp_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT,
  manager_id INT,

  CONSTRAINT fk_role
  FOREIGN KEY(role_id)
  REFERENCES role(role_id)
  ON DELETE SET NULL,

  CONSTRAINT fk_manager
  FOREIGN KEY(manager_id)
  REFERENCES employee(emp_id)
  ON DELETE SET NULL
);